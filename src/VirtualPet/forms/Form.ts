import { Form, FormOnSubmitEventHandler } from "@devvit/public-api"

export type FormConfig = {
  form: Form,
  handler: FormOnSubmitEventHandler,
}
