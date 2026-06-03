import { ContactForm } from '../models/ContactForm.js'

export const submitContact = async (req, res) => {
    try {
        const { nome, email, telefone, empresa, mensagem, doc_base64 } = req.body
        if (!nome || !email || !empresa || !mensagem)
            return res.status(400).json({ error: 'Name, email and message are required' })

            const submission = await ContactForm.create({
                nome,
                email,
                telefone:       telefone      || null,
                empresa,
                mensagem,
                estate:         'pending',
                date_sent:      new Date(),
                doc_base64:     doc_base64 || null,
            })
            res.status(201).json({ success: true, id: submission.id_contact_form })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
}

export const getSubmissions = async (req, res) => {
    try {
        const submissions = await ContactForm.findAll({
            order: [['date_sent', 'DESC']],
            attributes: { exclude: ['doc_base64'] }
        })
        res.json(submissions)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
}
