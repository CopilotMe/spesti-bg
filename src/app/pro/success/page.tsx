import { redirect } from "next/navigation";

export default function ProSuccessRedirect() {
  redirect("/pro/activate");
}
