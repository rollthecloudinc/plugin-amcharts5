import { Component, OnInit } from '@angular/core';
import { ContentPluginManager } from '@rollthecloudinc/content';

@Component({
    selector: 'plugin-download',
    template: `
        <div class="task">
            <p>Download</p>
        </div>
    `
})

export class DownloadComponent implements OnInit {
    constructor(
        private cpm: ContentPluginManager
    ) { 
        console.log('download component constructor');
    }

    ngOnInit() { }
}