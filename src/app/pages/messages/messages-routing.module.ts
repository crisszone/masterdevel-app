import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagesPage } from './messages.page';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: MessagesPage,
            }, {
                path: 'message',
                loadChildren: () => import('../message/message.module').then(m => m.MessagePageModule),
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MessagesPageRoutingModule { }
