import { Component, OnInit } from '@angular/core';
import { JournalSocketService } from '../journal-socket.service';
import { JournalDataService } from '../journal-data.service';
import { LocalStorageService } from '../local-storage.service';
import { SlimscrollCustomOptions } from '../slimscroll-custom-options';

@Component({
  selector: 'app-elite-inventory',
  templateUrl: './elite-inventory.component.html'
})
export class EliteInventoryComponent implements OnInit {
  sortInventory: string;
  sortInventoryDir: string;
  showingInventory = 'materials';
  showingFilter    = false;
  inventory        = [];
  materialCount    = 0;
  dataCount        = 0;
  cargoCount       = 0;

  constructor(
    private journalData: JournalDataService,
    private journalSocket: JournalSocketService,
    private storage: LocalStorageService,
    public slimscrollOptions: SlimscrollCustomOptions
  ) {
    this.sortInventory    = storage.get('inventory.sortBy', 'friendlyName');
    this.sortInventoryDir = storage.get('inventory.sortDir', 'asc');
  }

  ngOnInit() {
    this.updateMaterials();

    this.journalSocket.event('materials').subscribe(data => {
      this.updateMaterials();
    });
  }

  updateMaterials() {
    const materialsInfo = this.journalData.getData('materials');
    if (materialsInfo) {
      this.materialCount = (materialsInfo.materialCount || 0).toLocaleString();
      this.dataCount    = (materialsInfo.dataCount || 0).toLocaleString();

      if (this.showingInventory === 'materials' || this.showingInventory === 'data') {
        this.changeInventory(this.showingInventory);
      }
    }
  }

  changeInventory(inventoryType: string) {
    if (inventoryType === 'materials') {
      const materials = this.journalData.getData('materials', 'materials');
      this.inventory  = materials || [];
    } else if (inventoryType === 'data') {
      const data      = this.journalData.getData('materials', 'data');
      this.inventory  = data || [];
    } else if (inventoryType === 'cargo') {
      this.inventory  = [];
    }

    this.showingInventory = inventoryType;
  }

  toggleFilter() {
    this.showingFilter = !this.showingFilter;
  }

  inventorySort(sortBy: string) {
    if (this.sortInventory === sortBy) {
      // Toggle direction
      if (this.sortInventoryDir === 'asc') {
        this.sortInventoryDir = 'desc';
      } else {
        this.sortInventoryDir = 'asc';
      }
    } else {
      // Change sort type
      if (sortBy === 'friendlyName') {
        this.sortInventory = 'friendlyName';
        this.sortInventoryDir = 'asc';
      } else if (sortBy === 'count') {
        this.sortInventory = 'count';
        this.sortInventoryDir = 'desc';
      }
    }

    // Save it to local storage
    this.storage.set('inventory.sortDir', this.sortInventoryDir);
    this.storage.set('inventory.sortBy', this.sortInventory);
  }
}
