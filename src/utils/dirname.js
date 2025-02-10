import path from "path";
import { fileURLToPath } from "url";

const __filname = fileURLToPath(import.meta.url);
const pathFile = path.dirname(__filname);
const __dirname = path.resolve(pathFile, "../../")

export default __dirname;