import React from "react";
import { useDispatch } from "react-redux";
import { setTitleHeader } from "../../redux/features/titleHeaderSlice";

export default function RemboursementPage() {
  const dispatch = useDispatch();

  dispatch(setTitleHeader({ title: "Remboursements" }));
  return <div>RemboursementPage</div>;
}






