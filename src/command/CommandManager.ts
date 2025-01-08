import { ICommand } from './ICommand';
import logger from '../utils/logger'
import SkinCommand from './commands/SkinCommand'
import ProblemCommand from './commands/ProblemCommand'
import UniversityCommand from './commands/UniversityCommand'
import TraitCommand from './commands/TraitCommand'
import EndingCommand from './commands/EndingCommand'


export default class CommandManager {
    private commands = new Map();
    private regexCommands = new Set();

    constructor() {
        console.log('Loading commands');
        this.addCommand(new SkinCommand());
        this.addCommand(new ProblemCommand());
        this.addCommand(new UniversityCommand())
        this.addCommand(new TraitCommand())
        this.addCommand(new EndingCommand())
    }

    private addCommand(command: ICommand): void {
        if (typeof command.invoke === "string") {
            if (!this.commands.has(command.invoke)) {
                this.commands.set(command.invoke, command);
            }
        }else if (this.isRegExp(command.invoke)) {
            this.regexCommands.add(command);
        }
    }

    public getCommands(): ICommand[] {
        return this.commands.get(name);
    }

    public getCommand(name: string): ICommand | undefined {
        return this.commands.get(name);
    }

    public handleCommand(event: any): void {
        var prefix = '.';
        var content = event.content;
        if (!content.startsWith(prefix))
            return;
        var invoke = content.slice(prefix.length);
        if (this.commands.has(invoke)) {
            var command = this.commands.get(invoke);
            return command === null || command === void 0 ? void 0 : command.handle(event);
        }
        for (var _i = 0, _a = Array.from(this.regexCommands); _i < _a.length; _i++) { // 수정된 부분
            var command:any = _a[_i];
            if (command.invoke instanceof RegExp && command.invoke.test(invoke)) {
                event.content = invoke
                command.handle(event);
                return;
            }
        }
    }
    
    private isRegExp(value: unknown): value is RegExp {
        return Object.prototype.toString.call(value) === "[object RegExp]";
    }
}