
/*:ja
 * @plugindesc 必殺技コマンド
 * @author k-ito
 * @plugindesc TPが一定以上の時だけ、出るバトルコマンドが設定することが出来る。
 * @help アクター設定のメモに
 * <skillId:n>(nにはスキルタイプのIDを入力する)
 * を入れる事によって
 * そのスキルタイプをパラメータで設定したTP以上の値の時にしか
 * 出てこないコマンドを作ることが出来る。
 * @param TP値
 * @desc ステータスが追加されるタイミングのTP値を入れる。
 * @default 100
 */


(function() {
var parameters = PluginManager.parameters('SpecialSkill');    
var callobj = Window_ActorCommand.prototype.addSkillCommands;
var tpvalue = Number(parameters['TP値'] || 100);
Window_ActorCommand.prototype.addSkillCommands = function() {
    var skillTypes = this._actor.addedSkillTypes();
    skillTypes.sort(function(a, b) {
        return a - b;
    });
    skillTypes.forEach(function(stypeId) {
        var name = $dataSystem.skillTypes[stypeId];
        var skillId = $dataActors[this._actor._actorId].meta.skillId;
        if(skillId){
            if(skillId != stypeId){
                this.addCommand(name, 'skill', true, stypeId);
            }else if(this._actor.tp >= tpvalue){
                this.addCommand(name, 'skill', true, stypeId);
            }
        }else{
            this.addCommand(name, 'skill', true, stypeId);
        }
 
            
    }, this);
};
})();
 