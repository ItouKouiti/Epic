/*:ja
 * @plugindesc 連続アニメーションスキル
 * @author k-ito
 * @plugindesc　アニメーションを連続で表示して必殺技っぽい感じにする。
 * @help スキルのメモ欄に<animationIds:1,2,3>のようにカンマ区切りで
 * アニメーションIDを指定すると、スキルに設定したアニメーションと
 * 指定されたアニメーションIDが連続で表示されて
 * 必殺技っぽい感じになる。
 * 未使用削除ツール対策、animationId1～animationId5まで登録すると
 * 削除されなくなる。
 * @noteParam animationIds
 * @noteRequire 1
 * @noteType animation
 * @noteData skills
 * @noteParam animationId1
 * @noteRequire 1
 * @noteType animation
 * @noteData skills
 * @noteParam animationId2
 * @noteRequire 1
 * @noteType animation
 * @noteData skills
 * @noteParam animationId3
 * @noteRequire 1
 * @noteType animation
 * @noteData skills
 * @noteParam animationId4
 * @noteRequire 1
 * @noteType animation
 * @noteData skills
 * @noteParam animationId5
 * @noteRequire 1
 * @noteType animation
 * @noteData skills
 */ 
(function() {
   Window_BattleLog.prototype.startAction = function(subject, action, targets) {
    var item = action.item();
    var animationIds = item.meta.animationIds
    this.push('performActionStart', subject, action);
    this.push('waitForMovement');
    this.push('performAction', subject, action);
    if(animationIds){
        var animationList = animationIds.split(",");
        animationList.unshift(item.animationId);
        for(var i = 0; i<animationList.length; i++){
            var frame = Math.round($dataAnimations[animationList[i]].frames.length/4);
            this.push('showAnimation', subject, targets.clone(), animationList[i]);
            if(i===0){
                this.displayAction(subject, item);
            }
            if(i < (animationList.length -1 )){
                for(var j = 0; j<frame; j++){
                    this.push('wait');
                }
            }else{
                this.push('wait');
            }
        }
    }else{
        this.push('showAnimation', subject, targets.clone(), item.animationId);
        this.displayAction(subject, item);

    }
};

})();