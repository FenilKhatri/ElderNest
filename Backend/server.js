import app from "./app.js";
import ConnectDB from "./config/db.js";
import dns from "dns";

const PORT = process.env.PORT || 5000;

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.listen(PORT, () => {
    ConnectDB();
    console.log(`Server is running on PORT ${PORT}`);
});