export default interface Alert {
  color: "success" | "warning" | "error";
  message: string;
  title: string;
  visible: boolean;
}
