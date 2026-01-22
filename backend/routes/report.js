const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Analysis = require('../models/Analysis');

// GET /api/report/:id  → Download PDF Report
router.get('/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    const doc = new PDFDocument();
    const filename = `${analysis.paperTitle.replace(/ /g, "_")}_report.pdf`;

    // PDF headers
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // PDF CONTENT
    doc.fontSize(20).text("IntelliInsight - Analysis Report", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`📄 Paper Title: ${analysis.paperTitle}`);
    doc.text(`📌 Type: ${analysis.type} (${Math.round(analysis.typeConfidence * 100)}%)`);
    doc.text(`🔍 Nature: ${analysis.nature} (${Math.round(analysis.natureConfidence * 100)}%)`);
    doc.moveDown();

    doc.fontSize(16).text("Key Evidence:", { underline: true });
    analysis.evidence.forEach((ev, i) => {
      doc.fontSize(12).text(`${i + 1}. ${ev}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Error generating report" });
  }
});

module.exports = router;
