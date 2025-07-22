import { useContext } from "react";
import TransactionContext from "./TransactionContext";

const useTransaction = () => useContext(TransactionContext);

export default useTransaction; 