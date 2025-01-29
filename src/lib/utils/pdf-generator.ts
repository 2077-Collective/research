import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Article } from '$lib/types/article';

const headingStyles = {
	H1: { fontSize: 20, marginTop: 10, marginBottom: 4 },
	H2: { fontSize: 18, marginTop: 8, marginBottom: 4 },
	H3: { fontSize: 16, marginTop: 6, marginBottom: 4 },
	default: { fontSize: 14, marginTop: 2, marginBottom: 2 }
} as const;

export async function downloadPDF(article: Article) {
	try {
		const content = document.getElementById('content-container');
		if (!content) return;

		// Create PDF document
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'pt',
			format: 'a4'
		});

		// Add footer to all pages
		const addFooter = () => {
			const pageCount = pdf.internal.pages.length;
			const footerHeight = 20;
			const footerLogoSize = 10; // Slightly smaller logo

			const footerLogo = new Image();
			footerLogo.src = '/favicon.svg';

			return new Promise((resolve) => {
				footerLogo.onload = () => {
					const logoCanvas = document.createElement('canvas');
					const ctx = logoCanvas.getContext('2d');
					logoCanvas.width = footerLogo.width;
					logoCanvas.height = footerLogo.height;
					if (ctx) {
						ctx.fillStyle = '#666666';
						ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);
						ctx.globalCompositeOperation = 'destination-in';
						ctx.drawImage(footerLogo, 0, 0);
					}
					const footerLogoData = logoCanvas.toDataURL('image/png');

					for (let i = 1; i <= pageCount; i++) {
						pdf.setPage(i);
						const pageWidth = pdf.internal.pageSize.getWidth();
						const pageHeight = pdf.internal.pageSize.getHeight();

						// Center logo and text
						const logoWidth = (footerLogo.width / footerLogo.height) * footerLogoSize;
						const footerY = pageHeight - footerHeight;

						pdf.setFontSize(10);
						pdf.setTextColor(102, 102, 102);
						const footerText = '2077 Research';
						const textWidth = pdf.getTextWidth(footerText);
						const combinedWidth = logoWidth + 8 + textWidth; // Increased spacing between logo and text
						const startX = (pageWidth - combinedWidth) / 2;

						// Align logo vertically with text
						const textBaselineY = footerY;
						const logoY = textBaselineY - footerLogoSize * 0.8; // Adjust logo position to align with text

						pdf.addImage(footerLogoData, 'PNG', startX, logoY, logoWidth, footerLogoSize);
						pdf.text(footerText, startX + logoWidth + 8, textBaselineY);

						// Simpler page number
						pdf.text(`${i}`, pageWidth - margin - 10, textBaselineY);
					}
					resolve(true);
				};
			});
		};

		// Get page dimensions
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		const margin = 72; // 1 inch margin
		const footerMargin = 40; // Space reserved for footer
		const contentWidth = pageWidth - 2 * margin;

		// Add header with logo
		const logoImg = new Image();
		logoImg.src = '/favicon.svg';
		await new Promise((resolve) => {
			logoImg.onload = resolve;
		});
		const logoCanvas = document.createElement('canvas');
		const ctx = logoCanvas.getContext('2d');
		logoCanvas.width = logoImg.width;
		logoCanvas.height = logoImg.height;
		if (ctx) {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);
			ctx.globalCompositeOperation = 'destination-in';
			ctx.drawImage(logoImg, 0, 0);
		}
		const logoDataUrl = logoCanvas.toDataURL('image/png');

		// Add logo
		const logoHeight = 60;
		const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
		pdf.addImage(logoDataUrl, 'PNG', margin, margin, logoWidth, logoHeight);
		let currentY = margin + logoHeight + 40;

		// Add title
		pdf.setFont('helvetica', 'bold');
		pdf.setFontSize(32);
		const title = article.title;
		const titleLines = pdf.splitTextToSize(title, contentWidth);
		pdf.text(titleLines, margin, currentY);
		currentY += titleLines.length * 40 - 8; // Reduced spacing after title by 28px (from +20 to -8)

		// Add metadata (authors and date)
		pdf.setFont('helvetica', 'normal');
		pdf.setFontSize(13);

		pdf.setTextColor(75, 75, 75); // Set lighter shade of black (RGB: 75,75,75)
		const authors = `By ${article.authors.map((a) => a.fullName).join(', ')}`;
		pdf.text(authors, margin, currentY);
		currentY += 20;

		const date = new Date(article.scheduledPublishTime).toLocaleDateString('en-GB', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		pdf.text(date, margin, currentY);
		currentY += 40;

		// Reset text color to black for the rest of the content
		pdf.setTextColor(0, 0, 0);

		// Process content sections
		const sections = content.children;
		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];

			// Check if we need a new page
			if (currentY > pageHeight - margin - footerMargin) {
				pdf.addPage();
				currentY = margin;
			}

			// Handle different content types
			if (section instanceof HTMLHeadingElement) {
				pdf.setFont('helvetica', 'bold');
				let fontSize, marginTop, marginBottom;

				// Optimized heading styles for PDF reading
				const style =
					headingStyles[section.tagName as keyof typeof headingStyles] || headingStyles.default;
				fontSize = style.fontSize;
				marginTop = style.marginTop;
				marginBottom = style.marginBottom;

				// Add top margin
				currentY += marginTop;

				pdf.setFontSize(fontSize);
				const headingLines = pdf.splitTextToSize(
					section.textContent?.replace(/#$/, '') || '',
					contentWidth
				);

				// Check if heading needs a new page
				if (currentY + headingLines.length * (fontSize + 5) > pageHeight - margin - footerMargin) {
					pdf.addPage();
					currentY = margin;
				}

				pdf.text(headingLines, margin, currentY);
				currentY += headingLines.length * (fontSize + 5) + marginBottom;
			} else if (section instanceof HTMLParagraphElement) {
				// Check if paragraph contains an image
				const img = section.querySelector('img');
				if (img) {
					try {
						// Add reduced spacing before image (from 10 to -2)
						currentY -= 2;

						// Temporarily remove padding for capture
						const originalPadding = img.style.paddingBottom;
						img.style.paddingBottom = '0';

						// Use html2canvas to capture the image element
						const canvas = await html2canvas(img, {
							logging: false,
							useCORS: true,
							allowTaint: true,
							backgroundColor: null,
							removeContainer: true,
							scale: 2 // Increase quality
						});

						// Restore original padding
						img.style.paddingBottom = originalPadding;

						const imgData = canvas.toDataURL('image/jpeg', 1.0);
						const aspectRatio = canvas.height / canvas.width;
						let imgWidth = Math.min(contentWidth, 500);
						let imgHeight = imgWidth * aspectRatio;

						// Check if image height exceeds half page height and resize if necessary
						const maxHeight = (pageHeight - 2 * margin - footerMargin) / 2;
						if (imgHeight > maxHeight) {
							const scale = maxHeight / imgHeight;
							imgWidth *= scale;
							imgHeight = maxHeight;
						}

						// Check if image needs a new page
						if (currentY + imgHeight > pageHeight - margin - footerMargin) {
							pdf.addPage();
							currentY = margin;
						}

						// Center the image horizontally
						const xOffset = margin + (contentWidth - imgWidth) / 2;

						// Add image to PDF
						pdf.addImage(imgData, 'JPEG', xOffset, currentY, imgWidth, imgHeight);
						currentY += imgHeight;

						// Add image caption if exists
						const caption = img.getAttribute('alt');
						if (caption) {
							currentY += 10; // Space between image and caption
							pdf.setFont('helvetica', 'italic');
							pdf.setFontSize(10);
							pdf.setTextColor(100);
							const captionLines = pdf.splitTextToSize(caption, contentWidth);

							// Center the caption
							const captionWidth = pdf.getTextWidth(captionLines[0]);
							const captionX = margin + (contentWidth - captionWidth) / 2;
							pdf.text(captionLines, captionX, currentY);
							currentY += captionLines.length * 12;
							pdf.setTextColor(0);
						}

						// Add increased spacing after image (from 24 to 36)
						currentY += 36; // mb-9 equivalent
					} catch (error) {
						console.error('Failed to process image:', error);
					}
				} else {
					pdf.setFont('helvetica', 'normal');
					pdf.setFontSize(13);
					const text = section.textContent || '';
					const lines = pdf.splitTextToSize(text, contentWidth);
					const lineHeight = 18;

					// Calculate how many lines can fit in remaining space
					const remainingHeight = pageHeight - margin - currentY;
					const linesFitOnCurrentPage = Math.floor(remainingHeight / lineHeight);

					if (linesFitOnCurrentPage < 1) {
						// If we can't fit even one line, move to next page
						pdf.addPage();
						currentY = margin;
					}

					// Render lines that fit on current page
					let currentLine = 0;
					while (currentLine < lines.length) {
						// Calculate remaining space on current page
						const remainingLines = Math.min(
							Math.floor((pageHeight - margin - currentY) / lineHeight),
							lines.length - currentLine
						);

						// Add lines that fit on current page
						const pageLines = lines.slice(currentLine, currentLine + remainingLines);
						pdf.text(pageLines, margin, currentY);

						currentLine += remainingLines;
						currentY += remainingLines * lineHeight;

						// If there are more lines to render, add new page
						if (currentLine < lines.length) {
							pdf.addPage();
							currentY = margin;
						} else {
							currentY += 4; // Add paragraph spacing only after last part
						}
					}
				}
			} else if (section instanceof HTMLPreElement) {
				// Handle code blocks
				pdf.setFont('courier', 'normal');
				pdf.setFontSize(12); // Slightly smaller for code
				const code = section.textContent || '';
				const lines = pdf.splitTextToSize(code, contentWidth);

				// Add code block background
				const codeHeight = lines.length * 16;
				if (currentY + codeHeight > pageHeight - margin - footerMargin) {
					pdf.addPage();
					currentY = margin;
				}

				pdf.setFillColor(245, 245, 245);
				pdf.rect(margin - 5, currentY - 5, contentWidth + 10, codeHeight + 10, 'F');
				pdf.setTextColor(0, 0, 0);
				pdf.text(lines, margin, currentY);
				currentY += codeHeight + 20;
			}
		}

		// Add footer before saving
		await addFooter();
		pdf.save(`${article.slug}.pdf`);
	} catch (error) {
		console.error('Failed to generate PDF:', error);
	}
}
