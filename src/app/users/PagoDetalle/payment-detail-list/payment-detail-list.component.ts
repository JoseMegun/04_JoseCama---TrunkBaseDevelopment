import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { PaymentDetailService } from 'src/app/service/paymentDetail.service';
import { PaymentDetail } from 'src/app/model/paymentDetail.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payment-detail-list',
  templateUrl: './payment-detail-list.component.html',
  styleUrls: ['./payment-detail-list.component.css']
})
export class PaymentDetailListComponent implements OnInit, AfterViewInit {
  activePaymentDetails: PaymentDetail[] = [];
  inactivePaymentDetails: PaymentDetail[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  showActivePaymentDetails: boolean = true;

  searchStudent: string = '';
  searchAmount: string = '';
  searchPaymentDate: string = '';
  students: any[] = [];

  constructor(
    private paymentDetailService: PaymentDetailService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getAllPaymentDetails();
    this.getStudents();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.initializeMenu();
    this.initializeProgressBar();
  }

  public getAllPaymentDetails(): void {
    this.paymentDetailService.getAllPaymentDetails().subscribe(
      (details: PaymentDetail[]) => {
        this.activePaymentDetails = details.filter(detail => detail.status === 'A');
        this.inactivePaymentDetails = details.filter(detail => detail.status === 'I');
      },
      error => {
        console.error('Error al obtener los detalles de pago:', error);
        this.toastr.error('Error al obtener los detalles de pago. Por favor, inténtelo de nuevo.');
      }
    );
  }

  private getStudents(): void {
    this.students = [
      { id: '1', name: 'Juan', lastName: 'Pérez' },
      { id: '2', name: 'María', lastName: 'Gómez' }
    ];
  }

  deletePaymentDetail(id: string): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar este detalle de pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.paymentDetailService.deletePaymentDetail(id).subscribe(() => {
          Swal.fire('Eliminado!', 'El detalle de pago ha sido eliminado.', 'success');
          this.getAllPaymentDetails();
        }, error => {
          Swal.fire('Error', 'Error al eliminar el detalle de pago. Por favor, inténtelo de nuevo.', 'error');
          console.error('Error:', error);
        });
      }
    });
  }

  reactivatePaymentDetail(id: string): void {
    Swal.fire({
      title: '¿Estás seguro de reactivar este detalle de pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reactivar'
    }).then(result => {
      if (result.isConfirmed) {
        this.paymentDetailService.activatePaymentDetail(id).subscribe(() => {
          Swal.fire('Reactivado!', 'El detalle de pago ha sido reactivado.', 'success');
          this.getAllPaymentDetails();
        }, error => {
          Swal.fire('Error', 'Error al reactivar el detalle de pago. Por favor, inténtelo de nuevo.', 'error');
          console.error('Error:', error);
        });
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const maxPageActive = Math.ceil(this.activePaymentDetails.length / this.itemsPerPage);
    const maxPageInactive = Math.ceil(this.inactivePaymentDetails.length / this.itemsPerPage);
    const maxPage = Math.max(maxPageActive, maxPageInactive);
    if (this.currentPage < maxPage) {
      this.currentPage++;
    }
  }

  toggleShowInactive(): void {
    this.showActivePaymentDetails = !this.showActivePaymentDetails;
    this.currentPage = 1;
    this.getAllPaymentDetails();
  }

  exportToExcelActive(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.activePaymentDetails.map(detail => ({
      Manager: `${detail.payment?.manager?.firstName || 'No hay Manager'} ${detail.payment?.manager?.lastName || ''}`,
      Descripción: detail.payment?.description || 'Ninguno',
      'Apoderado Masculino': `${detail.maleAttorney?.names || 'No hay Apoderado'} ${detail.maleAttorney?.surnames || ''}`,
      'Apoderado Femenino': `${detail.femaleAttorney?.names || 'No hay Apoderado'} ${detail.femaleAttorney?.surnames || ''}`,
      Estudiante: `${detail.student?.name || 'Ninguno'} ${detail.student?.lastName || ''}`,
      Monto: this.formatAmount(detail.amount),
      Fecha: this.formatDate(detail.date),
      TipoDePago: detail.paymentType || 'Ninguno',
      Estado: detail.status || 'Ninguno'
    })));
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'DetallesPago');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  exportToCSV(): void {
    const header = ['Manager', 'Descripción', 'Apoderado Masculino', 'Apoderado Femenino', 'Estudiante', 'Monto', 'Fecha', 'Tipo de Pago', 'Estado'];
    const csvData = this.activePaymentDetails.map(detail => [
      `${detail.payment?.manager?.firstName || 'No hay Manager'} ${detail.payment?.manager?.lastName || ''}`,
      detail.payment?.description || 'Ninguno',
      `${detail.maleAttorney?.names || 'No hay Apoderado'} ${detail.maleAttorney?.surnames || ''}`,
      `${detail.femaleAttorney?.names || 'No hay Apoderado'} ${detail.femaleAttorney?.surnames || ''}`,
      `${detail.student?.name || 'Ninguno'} ${detail.student?.lastName || ''}`,
      this.formatAmount(detail.amount),
      this.formatDate(detail.date),
      detail.paymentType || 'Ninguno',
      detail.status || 'Ninguno'
    ]);

    csvData.unshift(header);
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'DetallesPago.csv');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.text('Lista de Detalles de Pago', 10, 10);
    const columns = ['Manager', 'Descripción', 'Apoderado Masculino', 'Apoderado Femenino', 'Estudiante', 'Monto', 'Fecha', 'Tipo de Pago', 'Estado'];
    const rows = this.activePaymentDetails.map(detail => [
      `${detail.payment?.manager?.firstName || 'No hay Manager'} ${detail.payment?.manager?.lastName || ''}`,
      detail.payment?.description || 'Ninguno',
      `${detail.maleAttorney?.names || 'No hay Apoderado'} ${detail.maleAttorney?.surnames || ''}`,
      `${detail.femaleAttorney?.names || 'No hay Apoderado'} ${detail.femaleAttorney?.surnames || ''}`,
      `${detail.student?.name || 'Ninguno'} ${detail.student?.lastName || ''}`,
      this.formatAmount(detail.amount),
      this.formatDate(detail.date),
      detail.paymentType || 'Ninguno',
      detail.status || 'Ninguno'
    ]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20
    });

    doc.save('DetallesPago.pdf');
  }

  formatAmount(amount: string | undefined): string {
    if (amount === undefined) {
      return '';
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return '';
    }

    return numericAmount.toFixed(2);
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) {
      return '';
    }

    const dateObject = typeof date === 'string' ? new Date(date) : date;

    const monthNames = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const month = monthNames[dateObject.getUTCMonth()];
    const year = dateObject.getUTCFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  private initializeSidebar(): void {
    const allDropdown = document.querySelectorAll<HTMLElement>('#sidebar .side-dropdown');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.querySelector<HTMLElement>('nav .toggle-sidebar');
    const allSideDivider = document.querySelectorAll<HTMLElement>('#sidebar .divider');

    if (!allDropdown || !sidebar || !toggleSidebar || !allSideDivider) {
      console.error('Elementos no encontrados');
      return;
    }

    allDropdown.forEach(item => {
      const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
      if (!a) return;
      this.renderer.listen(a, 'click', (e) => {
        e.preventDefault();

        if (!a.classList.contains('active')) {
          allDropdown.forEach(i => {
            const aLink = i.parentElement?.querySelector<HTMLElement>('a:first-child');
            if (aLink) {
              aLink.classList.remove('active');
              i.classList.remove('show');
            }
          });
        }

        a.classList.toggle('active');
        item.classList.toggle('show');
      });
    });

    if (sidebar.classList.contains('hide')) {
      allSideDivider.forEach(item => {
        item.textContent = '-';
      });
      allDropdown.forEach(item => {
        const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
        if (a) {
          a.classList.remove('active');
          item.classList.remove('show');
        }
      });
    } else {
      allSideDivider.forEach(item => {
        item.textContent = item.getAttribute('data-text');
      });
    }

    this.renderer.listen(toggleSidebar, 'click', () => {
      sidebar.classList.toggle('hide');

      if (sidebar.classList.contains('hide')) {
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });

        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
      } else {
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseleave', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = '-';
        });
      }
    });

    this.renderer.listen(sidebar, 'mouseenter', () => {
      if (sidebar.classList.contains('hide')) {
        allDropdown.forEach(item => {
          const a = item.parentElement?.querySelector<HTMLElement>('a:first-child');
          if (a) {
            a.classList.remove('active');
            item.classList.remove('show');
          }
        });
        allSideDivider.forEach(item => {
          item.textContent = item.getAttribute('data-text');
        });
      }
    });
  }

  private initializeMenu(): void {
    const allMenu = document.querySelectorAll<HTMLElement>('main .content-data .head .menu');

    allMenu.forEach(item => {
      const icon = item.querySelector<HTMLElement>('.icon');
      const menuLink = item.querySelector<HTMLElement>('.menu-link');
      if (!icon || !menuLink) return;

      this.renderer.listen(icon, 'click', () => {
        menuLink.classList.toggle('show');
      });

      this.renderer.listen(window, 'click', (e: Event) => {
        if (e.target !== icon && e.target !== menuLink && menuLink.classList.contains('show')) {
          menuLink.classList.remove('show');
        }
      });
    });
  }

  private initializeProgressBar(): void {
    const allProgress = document.querySelectorAll<HTMLElement>('main .card .progress');

    allProgress.forEach(item => {
      const value = item.getAttribute('data-value');
      if (value) {
        (item as HTMLElement).style.setProperty('--value', value);
      }
    });
  }
}
