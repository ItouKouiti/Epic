/*:ja
 * @plugindesc TPが一定以上の時に勝手にステータスが追加される。
 * @author k-ito
 * @help ステータスIDパラメータに好きなステータスを入れる（１つしか実装できない）。 
 * TP値の数以上の時に勝手にステータスが追加されるようになる。また、
 * TP値が一定値以下になるとそのステータスは消える。
 * @param ステータスID
 * @desc 追加されるステータスID
 * @default 1
 *
 * @param TP値
 * @desc ステータスが追加されるタイミングのTP値を入れる。
 * @default 100
 */
(function() {
    var parameters = PluginManager.parameters('SpecialStatus');
    var statusID = Number(parameters['ステータスID'] || 1);
    var tpvalue = Number(parameters['TP値'] || 100);
    BattleManager.invokeAction = function(subject, target) {
        this._logWindow.push('pushBaseLine');
        if (Math.random() < this._action.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else if (Math.random() < this._action.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else {
            this.invokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        this._logWindow.push('popBaseLine');
        if(subject._actorId){
            specialstatus(subject);
        }else if(target._actorId){
            specialstatus(target);
        }
        this.refreshStatus(subject);
    };
    
    function specialstatus(actor){
        if(actor._tp >= tpvalue){
            if(actor._states.indexOf(statusID)<0){
                actor._states.push(statusID);
            }
            }else{
                if(actor._states.indexOf(statusID)>-1){
                    actor._states.splice(actor._states.indexOf(statusID),1);
                }
        }
    }
})();
    