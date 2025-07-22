import { useContext } from "react";
import FriendContext from "./FriendContext";

const useFriend = () => useContext(FriendContext);

export default useFriend; 