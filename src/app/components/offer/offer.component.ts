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
  selectedPf: string = 'pfYes'; // Default value
  baseSalary:number=0;
  splAllow:number=0;

  constructor(private datePipe: DatePipe,private currencyPipe: CurrencyPipe, private fb: FormBuilder) {
    this.offerLetterForm = this.fb.group({
      candidateName: [''],
      position: [''],
      joiningDate: [''],
      companyName: [''],
      salary: [''],
      hrManagerName: [''],
      baseSalary:[''],
      splAllow:['']
    });
    this.generatedOfferLetter = '';
  }

  generateOfferLetter() {

    
      const formValues = this.offerLetterForm.value;
      const formattedJoiningDate = this.datePipe.transform(formValues.joiningDate, 'dd-MMM-yyyy');
    
      // Define Earnings and Deductions data
      const earnings = [
        { label: "Basic Salary", value: this.currencyPipe.transform(formValues.salary, 'INR') || '' },
        { label: "HRA", value: this.currencyPipe.transform(formValues.salary * 0.20, 'INR') || '' },
        { label: "Special Allowance", value: this.currencyPipe.transform(formValues.salary * 0.15, 'INR') || '' },
        { label: "Conveyance", value: this.currencyPipe.transform(1500, 'INR') || '' },
        { label: "Other Allowances", value: this.currencyPipe.transform(2000, 'INR') || '' }
      ];
    
      // const deductions = [
      //   { label: "Provident Fund (PF)", value: this.currencyPipe.transform(formValues.salary * 0.12, 'INR') || '' },
      //   { label: "ESI", value: this.currencyPipe.transform(formValues.salary > 15000 ? 0 : formValues.salary * 0.04, 'INR') || '' },
      //   { label: "Professional Tax", value: this.currencyPipe.transform(200, 'INR') || '' },
      //   { label: "Income Tax", value: this.currencyPipe.transform(formValues.salary * 0.1, 'INR') || '' },
      //   { label: "Other Deductions", value: this.currencyPipe.transform(500, 'INR') || '' }
      // ];
    
      // Calculate totals
      // const totalEarnings = earnings.reduce((acc, item) => acc + parseFloat(item.value.replace(/[^0-9.-]+/g, "")), 0);
      // const totalDeductions = deductions.reduce((acc, item) => acc + parseFloat(item.value.replace(/[^0-9.-]+/g, "")), 0);
      // const netSalary = totalEarnings - totalDeductions;
      // const netSalaryInWords = this.numberToWords(netSalary);
    
      // Offer letter with Salary Structure
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
    
    // const formValues = this.offerLetterForm.value;
    // const formattedJoiningDate = this.datePipe.transform(formValues.joiningDate, 'dd-MMM-yyyy');

   
    // // Use backticks for multi-line strings to avoid escaping issues
    // this.generatedOfferLetter = `
    //   <h2 style="text-align: center;">Offer Letter</h2>
    //   <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
    //   <p>Dear <b>${formValues.candidateName}</b>,</p>
      
    //   <p>We are delighted to offer you the position of <b>${formValues.position}</b>
    //     at Zubaid Infotech, effective <b>${formattedJoiningDate}</b>. Your acceptance of this 
    //     offer will confirm your employment with our company.</p>

    //   <p>As part of your position, your expected joining date will be 
    //     <b>${formattedJoiningDate}</b>. We are offering you an annual salary of 
    //     <b>${this.currencyPipe.transform(formValues.salary, 'INR')}</b> per annum. Other details regarding your benefits and 
    //     perks will be discussed upon your joining.</p>

    //   <p>We believe that you will bring exceptional value to our team and look forward 
    //     to having you onboard.</p>

    //   <p>Kindly confirm your acceptance of this offer by signing and returning a copy of this 
    //     letter by email or physically.</p>

    //   <br/>
    //   <p>Best Regards,</p>
    //   <p><b>${formValues.hrManagerName}</b><br/>HR Manager, <br/>Zubaid Infotech</p>
    // `;
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
  
       
       

        pdf.addPage();

        pdf.setFontSize(14);
        pdf.text("Salary Structure", pageWidth / 2, topMargin, { align: "center" });
  
        // Define table data
        const earnings = [
          { label: "Basic Salary", value: this.currencyPipe.transform(formValues.baseSalary*0.50, 'INR') || '' },
          { label: "HRA", value: this.currencyPipe.transform(formValues.baseSalary * 0.30, 'INR') || '' },
          { label: "Special Allowance", value: this.currencyPipe.transform(formValues.splAllow, 'INR') || '' },
          { label: "Conveyance", value: this.currencyPipe.transform(0, 'INR') || '' },
          { label: "Other Allowances", value: this.currencyPipe.transform(formValues.baseSalary * 0.20, 'INR') || '' }
        ];
  
        let esi=0;
        let pf=0;
        const basicsal=formValues.baseSalary*.50;
        const otherAllow=formValues.baseSalary*.20;
        if (this.selectedPf='pfYes'){
           pf= (basicsal+otherAllow)<15000?(basicsal+otherAllow)*.12:15000*.12;
           esi= formValues.baseSalary<21000?formValues.baseSalary*.0075:0;     
        }
        
        const deductions = [
          { label: "Provident Fund (PF)", value: this.currencyPipe.transform(pf, 'INR') || '' },
          { label: "ESI", value: this.currencyPipe.transform(esi, 'INR') || '' },
          { label: "Professional Tax", value: this.currencyPipe.transform(0, 'INR') || '' },
          { label: "Income Tax", value: this.currencyPipe.transform(0 * 0.1, 'INR') || '' },
          { label: "Other Deductions", value: this.currencyPipe.transform(0, 'INR') || '' }
        ];
  
        let yPos = topMargin + 20;
  
        // Earning column
        pdf.setFontSize(12);
        pdf.text("Earnings", leftMargin, yPos);
        yPos += 10;
        earnings.forEach(item => {
          pdf.text(`${item.label}:`, leftMargin, yPos);
          pdf.text(item.value, leftMargin + 40, yPos);
          yPos += 10;
        });
  
        yPos = topMargin + 20;
  
        // Deductions column
        pdf.text("Deductions", leftMargin + 100, topMargin + 20);
        yPos += 10;
        deductions.forEach(item => {
          pdf.text(`${item.label}:`, leftMargin + 100, yPos);
          pdf.text(item.value, leftMargin + 140, yPos);
          yPos += 10;
        });
  
        // Net Salary calculation
        const totalEarnings = earnings.reduce((acc, item) => acc + parseFloat(item.value.replace(/[^0-9.-]+/g,"")), 0);
        const totalDeductions = deductions.reduce((acc, item) => acc + parseFloat(item.value.replace(/[^0-9.-]+/g,"")), 0);
        const netSalary = totalEarnings - totalDeductions;
        const netSalaryInWords = this.numberToWords(netSalary);
  
        pdf.text(`Net Salary: ${this.currencyPipe.transform(netSalary, 'INR')}`, leftMargin, yPos + 10);
        pdf.text(`Net Salary (In Words): ${netSalaryInWords}`, leftMargin, yPos + 20);
  
        // Save the PDF
        pdf.save('Offer_Letter.pdf');
      });
    }
  } 
  
  // Helper function to convert number to words (simple version)
numberToWords(amount: number): string {
  // Define a function to convert numbers to words here or use an external library if needed
  return amount.toString(); // Placeholder for actual conversion function
}
}