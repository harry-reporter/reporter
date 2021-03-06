import { Suite } from 'src/store/modules/tests/types';
import { suiteBegin, testBegin, testResult, testsEnd } from 'src/store/modules/tests/actions';
import { TestsTypeKey } from 'src/store/modules/app/types';

export interface TestsContainerProps {
  tests: Suite[];
  gui: boolean;

  suiteBegin: typeof suiteBegin;
  testBegin: typeof testBegin;
  testResult: typeof testResult;
  testsEnd: typeof testsEnd;
  selectedTestsType: TestsTypeKey;
}

export interface TestsContainerState {}
