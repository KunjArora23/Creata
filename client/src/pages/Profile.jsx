import React, { useEffect, useState } from "react";
import useAuth from "../contexts/useAuth";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { User, Edit3, Save, X, Camera, MapPin, Calendar, Award, Shield } from "lucide-react";

const statusOptions = ["Active", "Busy", "Away", "Offline"];

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ bio: "", skills: "", status: "Active" });
  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      api.get("/api/profile/me", { withCredentials: true })
        .then(res => {
          setProfile(res.data.data);
          setForm({
            bio: res.data.data.bio || "",
            skills: (res.data.data.skills || []).join(", "),
            status: res.data.data.status || "Active"
          });
        })
        .catch(() => toast.error("Failed to load profile"));
    }
  }, [user, loading]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = e => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    data.append("bio", form.bio);
    data.append("skills", form.skills);
    data.append("status", form.status);
    if (avatar) data.append("avatar", avatar);
    try {
      const res = await api.put("/api/profile/update", data, { withCredentials: true });
      setProfile(res.data.data);
      toast.success("Profile updated!");
      setEditMode(false);
      setAvatar(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#6366F1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117] p-4"
    >
      <div className="max-w-6xl mx-auto font-inter">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-[#F2F3F5] font-grotesk mb-3">Profile</h1>
          <p className="text-[#AAB1B8] text-lg">Your professional identity and preferences</p>
        </motion.div>

        {!editMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="rounded-3xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-8 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6366F1]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#4F46E5]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10 flex flex-col items-center space-y-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center overflow-hidden border-4 border-[#30363D] shadow-2xl"
                  >
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-20 h-20 text-white" />
                    )}
                  </motion.div>
                  
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#F2F3F5] font-grotesk mb-2">{profile.name}</h2>
                    <p className="text-[#AAB1B8] text-lg">{profile.email}</p>
                  </div>

                  <div className="w-full">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      profile.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      profile.status === 'Busy' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      profile.status === 'Away' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        profile.status === 'Active' ? 'bg-green-400' :
                        profile.status === 'Busy' ? 'bg-yellow-400' :
                        profile.status === 'Away' ? 'bg-orange-400' :
                        'bg-gray-400'
                      }`}></div>
                      {profile.status}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditMode(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-[#F2F3F5] rounded-xl font-semibold hover:from-[#4F46E5] hover:to-[#3730A3] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Profile Details Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Bio Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_4px_24px_0_rgba(99,102,241,0.08)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">About Me</h3>
                </div>
                <p className="text-[#AAB1B8] text-lg leading-relaxed">
                  {profile.bio || (
                    <span className="italic text-[#6B7280]">
                      No bio added yet. Tell others about yourself and your expertise.
                    </span>
                  )}
                </p>
              </motion.div>

              {/* Skills Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_4px_24px_0_rgba(99,102,241,0.08)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">Skills & Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-4 py-2 bg-gradient-to-r from-[#6366F1]/20 to-[#4F46E5]/20 text-[#6366F1] rounded-full text-sm font-medium border border-[#6366F1]/30 hover:border-[#6366F1]/50 transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))
                  ) : (
                    <span className="italic text-[#6B7280] text-lg">
                      No skills added yet. Add your expertise to get better task matches.
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-6 shadow-[0_4px_24px_0_rgba(99,102,241,0.08)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F2F3F5] font-grotesk">Account Status</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                    <div className="text-2xl font-bold text-[#6366F1]">Verified</div>
                    <div className="text-sm text-[#AAB1B8]">Email Status</div>
                  </div>
                  <div className="text-center p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                    <div className="text-2xl font-bold text-[#6366F1]">Active</div>
                    <div className="text-sm text-[#AAB1B8]">Account Status</div>
                  </div>
                  <div className="text-center p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                    <div className="text-2xl font-bold text-[#6366F1]">User</div>
                    <div className="text-sm text-[#AAB1B8]">Role</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto"
          >
            <div className="rounded-3xl border border-[#30363D] bg-gradient-to-br from-[#161B22] to-[#1F2937] p-8 space-y-8 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-[#F2F3F5] font-grotesk mb-2">Edit Profile</h3>
                <p className="text-[#AAB1B8] text-lg">Update your information and preferences</p>
              </div>

              {/* Avatar Section */}
              <div className="flex justify-center">
                <label className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center overflow-hidden border-4 border-[#30363D] shadow-2xl cursor-pointer hover:scale-105 transition-transform group">
                  {profile.avatarUrl && !avatar ? (
                    <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : avatar ? (
                    <img src={URL.createObjectURL(avatar)} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-20 h-20 text-white" />
                  )}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                      <span className="text-white text-sm font-medium">Change Photo</span>
                    </div>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-[#AAB1B8] mb-3">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                    className="w-full px-4 py-4 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all resize-none text-lg"
                    value={form.bio}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-[#AAB1B8] mb-3">
                    Skills & Expertise
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    placeholder="e.g. React, Node.js, UI/UX Design, Content Writing"
                    className="w-full px-4 py-4 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] placeholder-[#6B7280] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all text-lg"
                    value={form.skills}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-[#6B7280] mt-2">Separate skills with commas</p>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#AAB1B8] mb-3">
                  Availability Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full px-4 py-4 rounded-xl border border-[#30363D] bg-[#0D1117] text-[#F2F3F5] focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all text-lg"
                  value={form.status}
                  onChange={handleChange}
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-[#F2F3F5] rounded-xl font-semibold hover:from-[#4F46E5] hover:to-[#3730A3] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 text-lg"
                >
                  <Save className="w-6 h-6" />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#21262C] text-[#F2F3F5] rounded-xl font-semibold border border-[#30363D] hover:bg-[#161B22] transition-all flex items-center gap-3 text-lg"
                  onClick={() => { setEditMode(false); setAvatar(null); }}
                >
                  <X className="w-6 h-6" />
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};

export default Profile; 