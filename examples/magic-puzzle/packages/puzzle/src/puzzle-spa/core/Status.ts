import { PuzzleApp } from '../type';
import { AppStatusEnums } from './const';

class AppStatus {
    public bootstrapped: Set<PuzzleApp>;

    public toPrefetch: Set<PuzzleApp>;
    public prefetched: Set<PuzzleApp>;

    public toMount: Set<PuzzleApp>;
    public mounted: Set<PuzzleApp>;

    public toUpdate: Set<PuzzleApp>;
    public updating: Set<PuzzleApp>;
    public updated: Set<PuzzleApp>;

    public toUnmount: Set<PuzzleApp>;
    public unmounted: Set<PuzzleApp>;
    
    constructor() {
      this.init();
    }
    
    private init() {
      Object.keys(AppStatusEnums).forEach((statusName: AppStatusEnums) => {
        this[statusName] = new Set<PuzzleApp>();
      });
    }
}

export default AppStatus;