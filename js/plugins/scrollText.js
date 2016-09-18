/*:ja
@plugindesc 文章のスクロール表示が出来ないの対応プラグイン
* @author k-ito
*
*/

Window_ScrollText.prototype.updateMessage = function() {
    this.origin.y += this.scrollSpeed();
    this._windowContentsSprite.worldTransform.ty = 0;
    if (this.origin.y >= this.contents.height) {
        this.terminateMessage();
    }
};