export interface ValidatableForm {
  componentName: string
  validate(): Promise<any>
}
