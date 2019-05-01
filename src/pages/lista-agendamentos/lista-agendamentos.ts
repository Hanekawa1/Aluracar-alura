import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';
import { AgendamentoDaoProvider } from '../../providers/agendamento-dao/agendamento-dao';
import { AgendamentosServiceProvider } from '../../providers/agendamentos-service/agendamentos-service';
import { Agendamento } from '../../modelos/agendamento';

@IonicPage()
@Component({
  selector: 'page-lista-agendamentos',
  templateUrl: 'lista-agendamentos.html',
})
export class ListaAgendamentosPage {

  agendamentos: Agendamento[];
  private _alerta: Alert;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _alertCtrl: AlertController,
              private _agendamentosService: AgendamentosServiceProvider,
              private _agendamentoDao: AgendamentoDaoProvider) {
  }
  ionViewDidLoad(){
    this._agendamentoDao.listaTodos()
        .subscribe(
          (agendamentos: Agendamento[]) => {
            this.agendamentos = agendamentos;
          })
  }
  reenvia(agendamento: Agendamento){

            this._alerta = this._alertCtrl.create({
              title: 'Aviso',
              buttons: [{ text : 'Ok' }]
            });

            let mensagem = '';

      this._agendamentosService.agenda(agendamento)
      .mergeMap((valor) => {
        let Observable = this._agendamentoDao.salva(agendamento);
        if(valor instanceof Error){
          throw valor;
        }
        return Observable;
      })
      .finally(
        () => {
          this._alerta.setSubTitle(mensagem);
          this._alerta.present();
              })
      .subscribe(
        () => mensagem = 'Agendamento reenviado!',
        (err: Error) => mensagem = err.message
      );
    }
}
