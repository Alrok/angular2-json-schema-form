import {
  Component, ComponentFactoryResolver, ComponentRef, Input,
  AfterContentChecked, ViewChild, ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'fieldset-widget',
  template: `
    <fieldset [disabled]="layoutNode?.readonly" [class]="layoutNode?.htmlClass">
      <legend [class.sr-only]="layoutNode?.notitle">{{layoutNode?.title}}</legend>
      <div class="help-block" *ngIf="!!layoutNode?.description">{{layoutNode?.description}}</div>
      <div #widgetContainer></div>
    </fieldset>
  `,
})
export class FieldsetComponent implements OnInit, AfterContentChecked {
  private controlInitialized: boolean = false;
  @Input() layoutNode: any; // JSON Schema Form layout array
  @Input() formGroup: FormGroup; // Angular 2 FormGroup object
  @Input() formOptions: any; // Global form defaults and options
  @Input() debug: boolean;
  @ViewChild('widgetContainer', { read: ViewContainerRef })
    private widgetContainer: ViewContainerRef;

  constructor(
    private componentFactory: ComponentFactoryResolver,
  ) {}

  ngAfterContentChecked() {
    if (!this.controlInitialized && this.layoutNode && 'items' in this.layoutNode) {
      let layoutArray =
        (Array.isArray(this.layoutNode.items)) ? this.layoutNode.items : [this.layoutNode.items];
      this.widgetContainer.clear();
      for (let i = 0, l = layoutArray.length; i < l; i++) {
        let addedNode: ComponentRef<any> = this.widgetContainer.createComponent(
          this.componentFactory.resolveComponentFactory(this.formOptions.framework)
        );
        addedNode.instance.formGroup = this.formGroup;
        addedNode.instance.layoutNode = layoutArray[i];
        addedNode.instance.formOptions = this.formOptions;
        addedNode.instance.debug = this.debug || false;
      }
      this.controlInitialized = true;
    }
  }
}