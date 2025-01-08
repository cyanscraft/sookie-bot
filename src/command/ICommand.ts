export interface ICommand {
    handle(event: any): void;
    help?: string;
    invoke: string | RegExp;
}