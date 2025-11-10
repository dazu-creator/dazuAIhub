import express from 'express';
import cors from 'cors';
import { openDb } from './database';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const app = express();

// Enable CORS for all routes. This handles pre-flight requests automatically.
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3001;

const coursesData = [
    { name: 'AI Masterclass (5 sessions)', price: 10000 },
    { name: 'AI for Business & Branding (4 sessions)', price: 10000 },
    { name: 'Advanced AI for Your Profession (5 sessions)', price: 15000 },
    { name: 'Automation and Agents Class (5 sessions)', price: 10000 },
    { name: 'Introduction to Prompt Engineering (3 Sessions)', price: 8000 },
    { name: 'Generative AI for Creatives (4 Sessions)', price: 12000 },
    { name: 'AI Ethics and Responsible Innovation (3 Sessions)', price: 10000 },
    { name: 'Web development using Ai < 1 month>', price: 30000 },
];

if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn("\n[WARNING] GMAIL_APP_PASSWORD is not set in the environment variables.");
    console.warn("Email notifications for new registrations will NOT be sent.");
    console.warn("Please create a Gmail App Password and add it to your environment to enable this feature.\n");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dazuai01@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD, // Use an App Password here
    },
});

/**
 * Appends registration data to a configured Google Sheet.
 * This function requires two environment variables to be set:
 * 1. SPREADSHEET_ID: The ID of your Google Sheet.
 * 2. GOOGLE_SHEETS_CREDENTIALS: A JSON string of your Google Service Account credentials.
 */
async function appendToGoogleSheet(data: Record<string, any>) {
    if (!process.env.SPREADSHEET_ID || !process.env.GOOGLE_SHEETS_CREDENTIALS) {
        console.warn("\n[WARNING] Google Sheets environment variables (SPREADSHEET_ID, GOOGLE_SHEETS_CREDENTIALS) are not set.");
        console.warn("Registration data will NOT be sent to Google Sheets.\n");
        return;
    }

    try {
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Ensure your Google Sheet has these columns in this order.
        const headerRow = ['CreatedAt', 'Name', 'Email', 'Phone', 'County', 'Course', 'Level', 'Goals'];
        const newRow = [
            new Date().toISOString(),
            data.name,
            data.email,
            data.phone,
            data.county,
            data.course,
            data.level,
            data.goals,
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Sheet1!A1', // Assumes your data is in a sheet named 'Sheet1'.
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [newRow],
            },
        });
        console.log("Successfully appended data to Google Sheet.");
    } catch (error) {
        console.error("Error appending data to Google Sheet:", error);
        // Log the error but don't re-throw, so the main registration process is not blocked.
    }
}


app.get('/courses', (req, res) => {
    res.json(coursesData);
});

app.post('/register', async (req, res) => {
    const { name, email, phone, county, course, level, goals } = req.body;

    if (!name || !email || !phone || !county || !course || !level || !goals) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await openDb();
        const result = await db.run(
            'INSERT INTO registrations (name, email, phone, county, course, level, goals) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, phone, county, course, level, goals]
        );
        
        const registrationData = { name, email, phone, county, course, level, goals };

        // Send data to Google Sheets
        await appendToGoogleSheet(registrationData);

        // Send email notification only if the password is set
        if (process.env.GMAIL_APP_PASSWORD) {
            const mailOptions = {
                from: '"Dazu AI Hub" <dazuai01@gmail.com>',
                to: 'dazuai01@gmail.com', // Admin's email
                subject: 'New Course Registration - Dazu AI Hub',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2 style="color: #059669;">New Student Registration</h2>
                        <p>A new student has registered for a course. Here are the details:</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="background-color: #f7f8fa;">
                                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Name:</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">${email}</td>
                            </tr>
                             <tr style="background-color: #f7f8fa;">
                                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">County:</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">${county}</td>
                            </tr>
                            <tr style="background-color: #f7f8fa;">
                                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Course:</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">${course}</td>
                            </tr>
                             <tr>
                                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Current Level:</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">${level}</td>
                            </tr>
                             <tr style="background-color: #f7f8fa;">
                                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Goals:</td>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">${goals}</td>
                            </tr>
                        </table>
                        <p>Please follow up with the student to complete the payment and onboarding process.</p>
                        <p style="margin-top: 20px; font-size: 0.9em; color: #6b7280;">This is an automated notification from the Dazu AI Hub website.</p>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                // Log the email error but don't fail the registration
                console.error("Failed to send registration email:", emailError);
            }
        }

        res.status(201).json({ message: 'Registration successful!', id: result.lastID });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
});

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'A valid email is required.' });
    }

    try {
        const db = await openDb();
        
        // Check for existing subscriber
        const existing = await db.get('SELECT email FROM subscribers WHERE email = ?', email);
        if (existing) {
            return res.status(409).json({ message: 'This email is already subscribed.' });
        }

        await db.run('INSERT INTO subscribers (email) VALUES (?)', email);

        res.status(201).json({ message: 'Subscription successful! Thank you.' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ message: 'An error occurred during subscription.' });
    }
});


app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
    openDb(); // Initialize DB on start
});