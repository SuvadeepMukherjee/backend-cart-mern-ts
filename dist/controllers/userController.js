import User from "../models/User.js";
/**
 * Retrieves a user from the database using their `userId`.
 */
const getUser = async (req, res) => {
    try {
        // Extracts userId from the request parameters.
        const userId = req.params.userId;
        // Searches for a user in the database using the userId.
        const user = await User.findOne({ userId });
        // If no user is found, return a 404 Not Found response.
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return; //Exits early to prevent further execution
        }
        //Sends the found user's ID as a JSON response
        res.json({ userId: user.userId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export { getUser };
