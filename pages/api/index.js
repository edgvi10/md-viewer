export default async (req, res) => {
    const { method, query, body } = req;

    if (method === 'GET') {
        try {


            return res.status(200).json({});
        } catch (e) {
            console.error(e.message);
            return res.status(500).json({ message: e.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
