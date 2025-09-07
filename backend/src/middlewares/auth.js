export const protect = async (req, res, next) => {
    try {
        const {userId} = req.auth();
        if(!userId) {
            return res.status(400).json({success: false, message: "Not Authenticated"})
        }
        next()
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})

    }
}

