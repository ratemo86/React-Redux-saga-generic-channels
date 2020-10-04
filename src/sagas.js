import { channel, delay } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import * as api from './api';

export default function* rootSaga() {
  yield takeLatest('FETCH_TASKS_STARTED', watchFetchTasks);
  yield takeLatestById(['TIMER_STARTED', 'TIMER_STOPPED'], handleProgressTimer);
}

//Fork as many processes but at the same time limit to one forked process for  each unique task
function* takeLatestById(actionType, saga) {
  const channelsMap = {};

  while (true) {
    const action = yield take(actionType);
    const { taskId } = action.payload;

    if (!channelsMap[taskId]) {
      channelsMap[taskId] = channel();
      yield takeLatest(channelsMap[taskId], saga);
    }

    yield put(channelsMap[taskId], action);
  }
}

function* handleProgressTimer({ type, payload }) {
  //No need to check for TIMER_STOPPED. Not incrementing implies stopped.No manipulating of timer
  if (type === 'TIMER_STARTED') {
    while (true) {
      yield call(delay, 1000);
      yield put({
        type: 'TIMER_INCREMENT',
        payload: { taskId: payload.taskId },
      });
    }
  }
}

function* watchFetchTasks() {
  try {
    const { data } = yield call(api.fetchTasks);
    yield put({
      type: 'FETCH_TASKS_SUCCEEDED',
      payload: { tasks: data },
    });
  } catch (e) {
    yield put({
      type: 'FETCH_TASKS_FAILED',
      payload: { error: e.message },
    });
  }
}
