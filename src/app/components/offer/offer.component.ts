import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CurrencyPipe,DatePipe } from '@angular/common';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {
  offerLetterForm: FormGroup;
  generatedOfferLetter: string;

  constructor(private datePipe: DatePipe,private currencyPipe: CurrencyPipe, private fb: FormBuilder) {
    this.offerLetterForm = this.fb.group({
      candidateName: [''],
      position: [''],
      joiningDate: [''],
      companyName: [''],
      salary: [''],
      hrManagerName: ['']
    });
    this.generatedOfferLetter = '';
  }

  generateOfferLetter() {
    const formValues = this.offerLetterForm.value;
    const formattedJoiningDate = this.datePipe.transform(formValues.joiningDate, 'dd-MMM-yyyy');

    // Use backticks for multi-line strings to avoid escaping issues
    this.generatedOfferLetter = `
      <h2 style="text-align: center;">Offer Letter</h2>
      <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
      <p>Dear <b>${formValues.candidateName}</b>,</p>
      
      <p>We are delighted to offer you the position of <b>${formValues.position}</b>
        at Zubaid Infotech, effective <b>${formattedJoiningDate}</b>. Your acceptance of this 
        offer will confirm your employment with our company.</p>

      <p>As part of your position, your expected joining date will be 
        <b>${formattedJoiningDate}</b>. We are offering you an annual salary of 
        <b>${this.currencyPipe.transform(formValues.salary, 'INR')}</b> per annum. Other details regarding your benefits and 
        perks will be discussed upon your joining.</p>

      <p>We believe that you will bring exceptional value to our team and look forward 
        to having you onboard.</p>

      <p>Kindly confirm your acceptance of this offer by signing and returning a copy of this 
        letter by email or physically.</p>

      <br/>
      <p>Best Regards,</p>
      <p><b>${formValues.hrManagerName}</b><br/>HR Manager, <br/>Zubaid Infotech</p>
    `;
  }

  generatePDF() {
    const formValues = this.offerLetterForm.value;
    const data = document.getElementById('offerLetterContent');
    const formattedJoiningDate = this.datePipe.transform(formValues.joiningDate, 'dd-MMM-yyyy');
  
    if (data) {
      html2canvas(data).then(canvas => {
        // Get PDF page size
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
  
        // Set margins (in millimeters)
        const leftMargin = 20;
        const topMargin = 20;
        const usableWidth = pageWidth - leftMargin * 2; // Account for left and right margins
  
        // Get canvas width and height
        const imgWidth = usableWidth;  // Fit within usable width of PDF page
        const imgHeight = canvas.height * imgWidth / canvas.width;  // Maintain aspect ratio
  
        // Check if the content height exceeds the page height and adjust if necessary
        if (imgHeight > pageHeight - topMargin * 2) {
          // Scale down image height if it exceeds page height
          const scaleFactor = (pageHeight - topMargin * 2) / imgHeight;
          const scaledWidth = imgWidth * scaleFactor;
          const scaledHeight = imgHeight * scaleFactor;
  
          // Add scaled image
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', leftMargin, topMargin, scaledWidth, scaledHeight);
        } else {
          // Add image without scaling if it fits the page
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', leftMargin, topMargin, imgWidth, imgHeight);
        }
  
        // Save the PDF
        pdf.save('Offer_Letter.pdf');
      });
    }
  }  
}