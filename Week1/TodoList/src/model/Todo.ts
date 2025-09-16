export class Todo {
  id: number;
  private title: string;
  private isDone: boolean;

  constructor(id: number, title: string, isDone: boolean = false) {
    this.id = id;
    this.title = title;
    this.isDone = isDone;
  }

  toggleDone(): Todo {
    return new Todo(this.id, this.title, !this.isDone);
  }
}