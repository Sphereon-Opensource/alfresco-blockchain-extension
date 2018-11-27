import {ContentModule} from '@alfresco/adf-content-services';
import {CoreModule} from '@alfresco/adf-core';
import {ExtensionsModule} from '@alfresco/adf-extensions';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TranslationService} from '@alfresco/adf-core';
import {BlockchainFactomService} from './blockchain-factom.service';
import {BlockchainSignAction, BlockchainVerifyAction} from './blockchain-factom.actions';

@NgModule({
  imports: [
    ExtensionsModule,
    FlexLayoutModule,
    CoreModule.forChild(),
    ContentModule.forChild(),
  ],
  declarations: [],
  exports: []
})
export class BlockchainFactomModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BlockchainFactomModule,
      providers: [BlockchainFactomService, BlockchainSignAction, BlockchainVerifyAction]
    };
  }

  constructor(translation: TranslationService) {
    // translation.addTranslationFolder('adf-core', 'assets/adf-core');
    translation.addTranslationFolder('alfresco-blockchain-extension', 'assets/blockchain');
  }
}
