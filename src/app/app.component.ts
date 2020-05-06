import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalService } from './components/modal/modal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private element: HTMLElement;
  title = 'CSV Editor';

  csvHeader: string[] = [];

  csvData: string[][] = [];

  @ViewChild('fileInput') fileInput;

  constructor(private modalService: ModalService, private elementRef: ElementRef) {
    this.element = this.elementRef.nativeElement;
  }

  ngOnInit() {}

  onDeleteColumn(i: number) {
    this.csvHeader.splice(i, 1);
    this.csvData.forEach((line) => {
      line.splice(i, 1);
    });
  }

  onDeleteRow(i: number) {
    this.csvData.splice(i, 1);
  }

  addRow() {
    const newLine = this.csvHeader.map(() => '');
    this.csvData.push(newLine);
  }

  addColumn() {
    const newColumnName = window.prompt('new column name?');
    if (newColumnName) {
      this.csvHeader.push(newColumnName);

      this.csvData.forEach((line) => {
        line.push('');
      });
    }
  }

  clear() {
    this.csvHeader = [];
    this.csvData = [];
  }

  dummy() {
    this.csvHeader = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6', 'Item7', 'Item8', 'Item9', 'Item10'];
    this.csvData = [];

    for (let i = 1; i <= 50; i++) {
      const line: string[] = [];
      for (let j = 0; j < this.csvHeader.length; j++) {
        line.push(Math.random().toString(32).substring(2));
      }
      this.csvData.push(line);
    }
  }

  onEdit(id: string, i: number) {
    const datas = this.csvData[i].map((d, index) => {
      return {
        label: this.csvHeader[index],
        value: d,
      };
    });

    const modal = this.modalService.open(id, datas);

    modal.save$.subscribe((savedData) => {
      console.log(savedData);

      if (savedData) {
        this.csvData[i] = savedData.map((d) => d.value);
      }
    });
  }

  export() {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    // ヘッダー
    let content = 'No,' + this.csvHeader.join(',') + '\n';

    // データ
    this.csvData.forEach((line, index) => {
      content += (index + 1).toString() + ',' + line.join(',') + '\n';
    });

    const blob = new Blob([bom, content], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);

    const link: HTMLAnchorElement = this.element.querySelector('#csv-donwload') as HTMLAnchorElement;
    link.href = url;
    link.download = 'test.csv';
    link.click();
  }

  import(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;

    files[0].text().then((csv) => {
      const lines = csv.split(/\r|\n/).filter((line) => {
        return line !== '';
      });

      const firstLine = lines.shift().split(',');
      // No列は削除
      const numHeader = firstLine.shift();

      console.log(numHeader);

      if (numHeader !== 'No') {
        window.alert('Required: [ No ] in the first column.');
        return;
      }

      this.csvHeader = firstLine;

      this.csvData = lines.map((line) => {
        const data = line.split(',');

        // No列は削除
        data.shift();

        return data;
      });
    });
  }

  dropX(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.csvHeader, event.previousIndex, event.currentIndex);

    this.csvData.forEach((line) => {
      const prev = line[event.previousIndex];
      const current = line[event.currentIndex];
      line[event.previousIndex] = current;
      line[event.currentIndex] = prev;
    });
  }

  dropY(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.csvData, event.previousIndex, event.currentIndex);
  }
}
