import Axios from "axios";

export default Axios.create({
    baseURL: "https://opentdb.com/api.php"
});