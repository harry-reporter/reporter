import { Suite } from 'src/store/modules/tests/types';
import { TestsViewMode } from 'src/store/modules/app/types';
import { setTestsViewMode } from 'src/store/modules/app/actions';
import { TestBoxesCache } from 'src/components/modules/TestBox/utils';

export interface TestBoxProps {
  isGui: boolean;
  data: Suite;
  style?: React.CSSProperties;
  className?: string;
  isOpen?: boolean;
  uuid?: string;
  setIsOpenForTestBox?: (isOpen: boolean, uuid: string) => void;
  cache: TestBoxesCache;
  index: string;
  testsViewMode?: TestsViewMode;

  measure?: () => any;
  setTestsViewMode?: typeof setTestsViewMode;
  acceptTest?: (suite, browserId, attempt, stateName) => void;
}

export interface TestBoxState {
  isOpen: boolean;
}

export interface Measurer {
  measure?: () => any;
}
