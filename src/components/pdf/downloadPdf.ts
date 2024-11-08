/* eslint-disable prettier/prettier */
// utils/downloadPDF.ts  
import jsPDF from 'jspdf';  
import html2canvas from 'html2canvas';  

const downloadPDF = async (elementId: string, title: string) => {  
  const input = document.getElementById(elementId);  

  if (input) {  
    const canvas = await html2canvas(input);  
    const dataUrl = canvas.toDataURL('image/png');  
  
    const pdf = new jsPDF({  
      orientation: 'portrait',  
      unit: 'pt',  
      format: 'a4',  
      putOnlyUsedFonts: true,  
    });  

    const imgWidth = 190; // Set the desired image width  
    const pageHeight = pdf.internal.pageSize.height;  
    const imgHeight = (canvas.height * imgWidth) / canvas.width;  
    let heightLeft = imgHeight;  

    let position = 0;  

    // If the image height is greater than one page, create multiple pages  
    if (heightLeft >= pageHeight) {  
      position = 0;  
      while (heightLeft >= 0) {  
        pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);  
        heightLeft -= pageHeight;  
        position -= pageHeight; // Move to the next page position  
        if (heightLeft >= 0) {  
          pdf.addPage();  
        }  
      }  
    } else {  
      pdf.addImage(dataUrl, 'PNG', 10, position, imgWidth, imgHeight);  
    }  

    pdf.save(`${title}.pdf`); // Downloads pdf with the title  
  }  
};  

export default downloadPDF;