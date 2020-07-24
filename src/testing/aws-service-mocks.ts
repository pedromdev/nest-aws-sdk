import { AwsService } from '../lib/types';
import { getAwsServiceToken } from '../lib/tokens';
import { Provider, ClassProvider, ValueProvider, FactoryProvider, ExistingProvider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

type MockProvider<T> = Omit<ClassProvider<T>, 'provide'>
  | Omit<ValueProvider<T>, 'provide'>
  | Omit<FactoryProvider<T>, 'provide'>
  | Omit<ExistingProvider<T>, 'provide'>;

export function createAwsServiceMock(service: AwsService, provider: MockProvider<AwsService>): Provider<AwsService> {
  return {
    ...provider,
    provide: getAwsServiceToken(service),
  };
};

export function getAwsServiceMock(module: TestingModule, service: AwsService) {
  return module.get(getAwsServiceToken(service));
}

export function createAwsServicePromisableFunction<T>(response: 'reject' | 'resolve', result?: T) {
  return {
    promise() {
      if (response === 'reject') {
        return Promise.reject(result);
      }
      return Promise.resolve(result);
    } 
  };
};

export function createAwsServicePromisableSpy<T, K>(object: T, method: keyof T, response: 'reject' | 'resolve', result?: K) {
  return spyOn(object, method)
    .and
    .returnValue(createAwsServicePromisableFunction(response, result));
};
