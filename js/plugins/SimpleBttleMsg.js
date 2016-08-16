/*:ja
 * @plugindesc 戦闘メッセージ省略
 * @author k-ito
 * @plugindesc スキル名,itemのみにする。その他メッセージの省略を設定できる。
 * @help パラメータの値を1にすると省略となる。
 *
 * @param Failure
 * @desc 1の時は失敗メッセージ省略
 * @default 0
 * @param Critical
 * @desc 1の時はクリティカルメッセージ省略
 * @default 0
 * @param HP
 * @desc 1の時はHPダメージメッセージ省略
 * @default 0
 * @param MP
 * @desc 1の時はMPダメージメッセージ省略
 * @default 0
 * @param TP
 * @desc 1の時はTPダメージメッセージ省略
 * @default 0
 * @param Miss
 * @desc 1の時はミスメッセージ省略
 * @default 0
 * @param Evasion
 * @desc 1の時は効果なしメッセージ省略
 * @default 0
 * @param AddedStates
 * @desc 1の時はステータス追加メッセージ省略
 * @default 0
 * @param RemovedStates
 * @desc 1の時はステータス解除メッセージ省略
 * @default 0
 * @param Buffs
 * @desc 1の時のステータス変化メッセージ省略
 * @default 0

 */


(function() {
    var parameters = PluginManager.parameters('SimpleBttleMsg');
    var failure = Number(parameters['Failure'])
    var critical = Number(parameters['Critical']);
    var hP = Number(parameters['HP']);
    var mP = Number(parameters['MP']);
    var tP = Number(parameters['TP']);
    var miss = Number(parameters['Miss']);
    var evasion = Number(parameters['Evasion']);
    var addedStates = Number(parameters['AddedStates']);
    var removedStates = Number(parameters['RemovedStates']);
    var buffs = Number(parameters['Buffs'])
    
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        var numMethods = this._methods.length;
        if (!(DataManager.isSkill(item) && item.id == subject.attackSkillId())) {
            this.push('addText', item.name);
        }
        if (this._methods.length === numMethods) {
        this.push('wait');
        }
    };
    
    Window_BattleLog.prototype.drawLineText = function(index) {
    var rect = this.itemRectForText(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawText(this._lines[index], rect.x, rect.y, rect.width, 'center');
    };

    Window_BattleLog.prototype.displayFailure = function(target) {
        if (target.result().isHit() && !target.result().success) {
            if(!failure){
                this.push('addText', TextManager.actionFailure.format(target.name()));
            }
        }
    };

    Window_BattleLog.prototype.displayCritical = function(target) {
        if(!critical){
            if (target.result().critical) {
                if (target.isActor()) {
                    this.push('addText', TextManager.criticalToActor);
                } else {
                    this.push('addText', TextManager.criticalToEnemy);
                }
            }
        }
    };
    
    Window_BattleLog.prototype.displayMiss = function(target) {
        var fmt;
        if (target.result().physical) {
            fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
            this.push('performMiss', target);
        } else {
            fmt = TextManager.actionFailure;
        }
        if(!miss){
            this.push('addText', fmt.format(target.name()));
        }
    };

    Window_BattleLog.prototype.displayEvasion = function(target) {
        var fmt;
        if (target.result().physical) {
            fmt = TextManager.evasion;
            this.push('performEvasion', target);
        } else {
            fmt = TextManager.magicEvasion;
            this.push('performMagicEvasion', target);
        }
        if(!evasion){
            this.push('addText', fmt.format(target.name()));
        }
    };

    Window_BattleLog.prototype.displayHpDamage = function(target) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.push('performDamage', target);
            }
            if (target.result().hpDamage < 0) {
                this.push('performRecovery', target);
            }
            if(!hP){
                this.push('addText', this.makeHpDamageText(target));
            }
        }
    };

    Window_BattleLog.prototype.displayMpDamage = function(target) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push('performRecovery', target);
            }
            if(!mP){
                this.push('addText', this.makeMpDamageText(target));
            }
        }
    };

    Window_BattleLog.prototype.displayTpDamage = function(target) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push('performRecovery', target);
            }
            if(!tP){
                this.push('addText', this.makeTpDamageText(target));
            }
        }
    };
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        target.result().addedStateObjects().forEach(function(state) {
            var stateMsg = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push('performCollapse', target);
            }
            if (stateMsg) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                if(!addedStates){
                    this.push('addText', target.name() + stateMsg);
                }
                this.push('waitForEffect');
            }
        }, this);
    };

    Window_BattleLog.prototype.displayRemovedStates = function(target) {
        target.result().removedStateObjects().forEach(function(state) {
            if (state.message4) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                if(!removedStates){
                    this.push('addText', target.name() + state.message4);
                }
            }
        }, this);
    };
    Window_BattleLog.prototype.displayBuffs = function(target, buffs, fmt) {
        buffs.forEach(function(paramId) {
            this.push('popBaseLine');
            this.push('pushBaseLine');
            if(!buffs){
                this.push('addText', fmt.format(target.name(), TextManager.param(paramId)));
            }
        }, this);
    };
})();