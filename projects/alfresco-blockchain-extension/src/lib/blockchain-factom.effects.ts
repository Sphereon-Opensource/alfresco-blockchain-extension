import {BlockchainFactomService} from './blockchain-factom.service';

import {
    BlockchainSignAction,
    BLOCKCHAIN_REGISTER,
    BlockchainVerifyAction,
    BLOCKCHAIN_VERIFY
} from './blockchain-factom.actions';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppStore} from '../../../app/store/states/app.state';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {NotificationService} from '@alfresco/adf-core';
import {MatSnackBarConfig} from '@angular/material';
import {map, take} from 'rxjs/operators';
import {appSelection} from '../../../app/store/selectors/app.selectors';
import {Observable} from 'rxjs';


@Injectable()
export class BlockchainEffects {

    private snackBarConfig: MatSnackBarConfig;

    constructor(
        private store: Store<AppStore>,
        private actions$: Actions,
        private blockchainFactomService: BlockchainFactomService,
        private notification: NotificationService,
    ) {
        this.snackBarConfig = new MatSnackBarConfig();
        this.snackBarConfig.duration = 15000;
        this.snackBarConfig.panelClass = 'snackbarBlockchain';
        this.snackBarConfig.politeness = 'assertive';
    }


    @Effect({dispatch: false})
    blockchainSignNodes$ = this.actions$.pipe(
        ofType<BlockchainSignAction>(BLOCKCHAIN_REGISTER),
        map(action => {
            if (action.payload && action.payload.length > 0) {
                this.signNodes(action);
            } else {
                this.store
                    .select(appSelection)
                    .pipe(take(1))
                    .subscribe(selection => {
                        if (selection && !selection.isEmpty) {
                            this.signNodes(selection);
                        }
                    });
            }
        })
    );

    @Effect({dispatch: false})
    blockchainVerifyNodes$ = this.actions$.pipe(
        ofType<BlockchainVerifyAction>(BLOCKCHAIN_VERIFY),
        map(action => {
            if (action.payload && action.payload.length > 0) {
                this.verifyNodes(action.payload);
            } else {
                this.store
                    .select(appSelection)
                    .pipe(take(1))
                    .subscribe(selection => {
                        if (selection && !selection.isEmpty) {
                            this.verifyNodes(selection);
                        }
                    });
            }
        })
    );

    private signNodes(selection) {
        const messageBuilder = [];
        Observable.create(
            this.blockchainFactomService.signSelection(selection.nodes)
        ).subscribe(
            (result) => {
                if (result != null) {
                    result.forEach((message) => {
                        messageBuilder.push(message);
                        messageBuilder.push('\n');
                    });
                }
            },
            (error) => {
                this.toastMessage(error.message);
            }, () => {
                this.toastMessage(messageBuilder.join(''));
            }
        );
    }


    private verifyNodes(selection) {
        const messageBuilder = [];
        Observable.create(
            this.blockchainFactomService.verifySelection(selection.nodes)
        ).subscribe(
            (result) => {
                if (result != null) {
                    result.forEach((message) => {
                        messageBuilder.push(message);
                        messageBuilder.push('\n');
                    });
                }
            },
            (error) => {
                this.toastMessage(error.message);
            }, () => {
                this.toastMessage(messageBuilder.join(''));
            }
        );
    }

    private toastMessage(message: any) {
        this.notification.openSnackMessageAction(message, '', this.snackBarConfig);
    }
}
