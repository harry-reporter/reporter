import { TestsStore, WindowWithData } from './types';
import {
  getInitialState,
  formatSuitesData,
  addTestResult,
  forceUpdateSuiteData,
  setStatusToAll,
  formatSkips,
} from './utils';
import { findNode } from '../utils';
import { clone, values } from 'lodash';
import * as actionNames from './constants';
import { isSkippedStatus } from '../../../../common-utils';

const defaultState: TestsStore = {
  config: {
    gitUrl: '',
  },
  suiteIds: {
    all: [],
    failed: [],
  },
  suites: {},
  skips: {},
  stats: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    retries: 0,
  },
  gui: true,
  running: false,
};

const compiledData = (window as WindowWithData).data;

const initialState = compiledData
  ? getInitialState(compiledData)
  : defaultState;

export const reducer = (
  state: TestsStore = initialState,
  action,
): TestsStore => {
  const { type, payload } = action;

  switch (type) {
    case actionNames.INIT_GUI: {
      const {
        skips,
        suites,
        gui,
        config,
        total,
        passed,
        failed,
        skipped,
        retries,
      } = payload;
      return {
        ...state,
        skips: formatSkips(skips),
        gui,
        config,
        ...formatSuitesData(suites),
        stats: { total, passed, failed, skipped, retries },
      };
    }

    case actionNames.ACCEPT_ALL_REFS:
      return addTestResult(state, action);

    case actionNames.RUN_ALL: {
      const suites = { ...state.suites };
      values(suites).forEach((suite) => setStatusToAll(suite, action.payload.status));
      return {
        ...state,
        suites,
        running: true,
        stats: {
          ...defaultState.stats,
        },
      };
    }

    case actionNames.SUITE_BEGIN: {
      const suites = clone(state.suites);
      const { suitePath, status } = action.payload;
      const test = findNode(suites, suitePath);
      if (test) {
        test.status = status;
        forceUpdateSuiteData(suites, test);
      }
      return { ...state, suites };
    }

    case actionNames.TEST_BEGIN: {
      const suites = clone(state.suites);
      const { suitePath, status, browserId } = action.payload;
      const test = findNode(suites, suitePath);
      if (test) {
        test.status = status;
        test.browsers.forEach((b) => {
          if (b.name === browserId && !isSkippedStatus(b.result.status)) {
            b.result.status = status;
          }
        });
        forceUpdateSuiteData(suites, test);
      }
      return { ...state, suites };
    }

    case actionNames.RUN_FAILED:
    case actionNames.RETRY_SUITE:
    case actionNames.RETRY_TEST: {
      return { ...state, running: true };
    }

    case actionNames.TESTS_END: {
      return { ...state, running: false, stats: { ...payload.stats } };
    }

    case actionNames.TEST_RESULT: {
      return addTestResult(state, action);
    }

    default:
      return state;
  }
};
