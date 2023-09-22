import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';

@NgModule({
	declarations: [BlogPostComponent, BlogListComponent, BlogDetailsComponent],
	imports: [
		CommonModule,
		RouterModule,
		NgxEchartsModule,
		RichTextEditorAllModule
	]
})
export class BlogsModule { }
