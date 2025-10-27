// api/send-result-email.js
import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Only POST allowed" });

  try {
    const data = req.body;
    if (!data.email) return res.status(400).json({ message: "Missing recipient email" });

    // Load email template
    const templatePath = path.resolve("./templates/bac-email.html");
    const source = fs.readFileSync(templatePath, "utf8");
    const compile = handlebars.compile(source);

    const html = compile({
      name: data.name,
      email: data.email,
      company: data.company,
      designation: data.designation,
      physAge: data.physAge,
      bioAge: data.bioAge,
      diffText: data.diff > 0 ? `+${data.diff}` : data.diff,
      diffColor: data.diff > 0 ? "#c41230" : "#008000",
      emoji: data.diff > 0 ? "⚠️" : "💪",
      topFactors: data.topFactors,
      recommendations: data.recommendations,
      year: new Date().getFullYear(),
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.email,
      subject: "Your BAC Index Results",
      html,
    });

    // Optional: admin copy
    if (process.env.ADMIN_EMAIL)
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New BAC Index Submission: ${data.name}`,
        html,
      });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
