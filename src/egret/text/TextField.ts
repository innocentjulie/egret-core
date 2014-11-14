/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    /**
     * @class egret.TextField
     * @classdesc
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @extends egret.DisplayObject
     */
    export class TextField extends DisplayObject {
        public static default_fontFamily:string = "Arial";

        private isInput():boolean {
            return this._type == TextFieldType.INPUT;
        }

        public _inputEnabled:boolean = false;
        public _setTouchEnabled(value:boolean):void {
            super._setTouchEnabled(value);

            if (this.isInput()) {
                this._inputEnabled = true;
            }
        }

        /**
         * 文本字段的类型。
         * 以下 TextFieldType 常量中的任一个：TextFieldType.DYNAMIC（指定用户无法编辑的动态文本字段），或 TextFieldType.INPUT（指定用户可以编辑的输入文本字段）。
         * 默认值为 dynamic。
         * @member {string} egret.TextField#type
         */
        public _type:string = "";
        private _inputUtils:InputController;
        public set type(value:string) {
            this._setType(value);
        }

        public _setType(value:string):void {
            if (this._type != value) {
                this._type = value;
                if (this._type == TextFieldType.INPUT) {//input，如果没有设置过宽高，则设置默认值为100，30
                    if (!this._hasWidthSet) {
                        this._setWidth(100);
                    }
                    if (!this._hasHeightSet) {
                        this._setHeight(30);
                    }

                    //创建stageText
                    if (this._inputUtils == null) {
                        this._inputUtils = new egret.InputController();
                    }

                    this._inputUtils.init(this);
                    this._setDirty();

                    if (this._stage) {
                        this._inputUtils._addStageText();
                    }
                }
                else {
                    if (this._inputUtils) {
                        this._inputUtils._removeStageText();
                        this._inputUtils = null;
                    }
                }
            }
        }

        public get type():string {
            return this._type;
        }

        public get text():string {
            return this._getText();
        }

        public _getText():string {
            if (this._type == egret.TextFieldType.INPUT) {
                return this._inputUtils._getText();
            }

            return this._text;
        }

        public _setTextDirty(): void {
            this._setSizeDirty();
        }

        public set text(value:string) {
            this._setText(value);
        }

        /**
         * 作为文本字段中当前文本的字符串
         * @member {string} egret.TextField#text
         */
        public _text:string = "";

        public _setBaseText(value:string):void {
            if (value == null) {
                value = "";
            }
            if (this._text != value || this._displayAsPassword) {
                this._setTextDirty();
                this._text = value;
                var text:string = "";
                if (this._displayAsPassword) {
                    for (var i:number = 0, num = this._text.length; i < num; i++) {
                        switch (this._text.charAt(i)) {
                            case '\n' :
                                text += "\n";
                                break;
                            case '\r' :
                                break;
                            default :
                                text += '*';
                        }
                    }
                }
                else {
                    text = this._text;
                }

                this._setMiddleStyle([[text]]);
            }
        }

        public _setText(value:string):void {
            if (value == null) {
                value = "";
            }
            this._setBaseText(value);
            if (this._inputUtils) {
                this._inputUtils._setText(this._text);
            }
        }

        /**
         * 指定文本字段是否是密码文本字段。
         * 如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
         * 默认值为 false。
         * @member {boolean} egret.TextInput#displayAsPassword
         */
        public _displayAsPassword:boolean = false;
        public get displayAsPassword():boolean {
            return this._displayAsPassword;
        }

        public set displayAsPassword(value:boolean) {
            this._setDisplayAsPassword(value);
        }

        public _setDisplayAsPassword(value:boolean):void {
            if (this._displayAsPassword != value) {
                this._displayAsPassword = value;
                this._setText(this._text);
            }
        }

        /**
         * 使用此文本格式的文本的字体名称，以字符串形式表示。
         * 默认值 Arial。
         * @member {any} egret.TextField#fontFamily
         */
        public _fontFamily = TextField.default_fontFamily;

        public get fontFamily():string {
            return this._fontFamily;
        }

        public set fontFamily(value:string) {
            this._setFontFamily(value);
        }

        public _setFontFamily(value:string):void {
            if (this._fontFamily != value) {
                this._setTextDirty();
                this._fontFamily = value;
            }
        }

        /**
         * 使用此文本格式的文本的大小（以像素为单位）。
         * 默认值为 30。
         * @member {number} egret.TextField#size
         */
        public _size:number = 30;

        public get size():number {
            return this._size;
        }

        public set size(value:number) {
            this._setSize(value);
        }

        public _setSize(value:number):void {
            if (this._size != value) {
                this._setTextDirty();
                this._size = value;
            }
        }

        /**
         * 表示使用此文本格式的文本是否为斜体。
         * 如果值为 true，则文本为斜体；false，则为不使用斜体。
         * 默认值为 false。
         * @member {boolean} egret.TextField#italic
         */
        public _italic:boolean;

        public get italic():boolean {
            return this._italic;
        }

        public set italic(value:boolean) {
            this._setItalic(value);
        }

        public _setItalic(value:boolean):void {
            if (this._italic != value) {
                this._setTextDirty();
                this._italic = value;
            }
        }

        /**
         * 指定文本是否为粗体字。
         * 如果值为 true，则文本为粗体字；false，则为非粗体字。
         * 默认值为 false。
         * @member {boolean} egret.TextField#bold
         */
        public _bold:boolean;

        public get bold():boolean {
            return this._bold;
        }

        public set bold(value:boolean) {
            this._setBold(value);
        }

        public _setBold(value:boolean):void {
            if (this._bold != value) {
                this._setTextDirty();
                this._bold = value;
            }
        }

        public _textColorString:string = "#FFFFFF";

        /**
         * 表示文本的颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0xFFFFFF。
         * @member {number} egret.TextField#textColor
         */
        public _textColor:number = 0xFFFFFF;
        public get textColor():number {
            return this._textColor;
        }

        public set textColor(value:number) {
            this._setTextColor(value);
        }

        public _setTextColor(value:number):void {
            if (this._textColor != value) {
                this._setTextDirty();
                this._textColor = value;
                this._textColorString = toColorString(value);
            }
        }

        public _strokeColorString:string = "#000000";

        /**
         * 表示文本的描边颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0x000000。
         * @member {number} egret.TextField#strokeColor
         */
        public _strokeColor:number = 0x000000;
        public get strokeColor():number {
            return this._strokeColor;
        }

        public set strokeColor(value:number) {
            this._setStrokeColor(value);
        }

        public _setStrokeColor(value:number):void {
            if (this._strokeColor != value) {
                this._setTextDirty();
                this._strokeColor = value;
                this._strokeColorString = toColorString(value);
            }
        }

        /**
         * 表示描边宽度。
         * 0为没有描边。
         * 默认值为 0。
         * @member {number} egret.TextField#stroke
         */
        public _stroke:number = 0;

        public get stroke():number {
            return this._stroke;
        }

        public set stroke(value:number) {
            this._setStroke(value);
        }

        public _setStroke(value:number):void {
            if (this._stroke != value) {
                this._setTextDirty();
                this._stroke = value;
            }
        }

        /**
         * 文本水平对齐方式
         * 使用HorizontalAlign定义的常量。
         * 默认值为 HorizontalAlign.LEFT。
         * @member {string} egret.TextField#textAlign
         */
        public _textAlign:string = "left";

        public get textAlign():string {
            return this._textAlign;
        }

        public set textAlign(value:string) {
            this._setTextAlign(value);
        }

        public _setTextAlign(value:string):void {
            if (this._textAlign != value) {
                this._setTextDirty();
                this._textAlign = value;
            }
        }

        /**
         * 文本垂直对齐方式。
         * 使用VerticalAlign定义的常量。
         * 默认值为 VerticalAlign.TOP。
         * @member {string} egret.TextField#verticalAlign
         */
        public _verticalAlign:string = "top";

        public get verticalAlign():string {
            return this._verticalAlign;
        }

        public set verticalAlign(value:string) {
            this._setVerticalAlign(value);
        }

        public _setVerticalAlign(value:string):void {
            if (this._verticalAlign != value) {
                this._setTextDirty();
                this._verticalAlign = value;
            }
        }

        public maxWidth;

        /**
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。
         * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
         * 默认值为 0。
         * @type {number}
         * @private
         */
        public _maxChars:number = 0;
        public get maxChars():number {
            return this._maxChars;
        }

        public set maxChars(value:number) {
            this._setMaxChars(value);
        }

        public _setMaxChars(value:number):void {
            if (this._maxChars != value) {
                this._maxChars = value;
            }
        }

        public get maxScrollV():number {
            return this._numLines;
        }

        public get selectionBeginIndex():number {
            return 0;
        }
        public get selectionEndIndex():number {
            return 0;
        }
        public get caretIndex():number {
            return 0;
        }
        public _setSelection(beginIndex:number, endIndex:number) {

        }

        /**
         * 行间距
         * 一个整数，表示行与行之间的垂直间距量。
         * 默认值为 0。
         * @member {number} egret.TextField#lineSpacing
         */
        public _lineSpacing:number = 0;

        public get lineSpacing():number {
            return this._lineSpacing;
        }

        public set lineSpacing(value:number) {
            this._setLineSpacing(value);
        }

        public _setLineSpacing(value:number):void {
            if (this._lineSpacing != value) {
                this._setTextDirty();
                this._lineSpacing = value;
            }
        }

        public _getLineHeight(): number {
            return this._lineSpacing + this._size;
        }

        /**
         * 文本行数。【只读】
         * @member {number} egret.TextField#numLines
         */
        private _numLines:number = 0;
        public get numLines():number {
            return this._numLines;
        }

        /**
         * 表示字段是否为多行文本字段。注意，此属性仅在type为TextFieldType.INPUT时才有效。
         * 如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
         * 默认值为 false。
         * @member {boolean} egret.TextField#multiline
         */
        public _multiline:boolean = false;
        public set multiline(value:boolean) {
            this._setMultiline(value);
        }
        public _setMultiline(value:boolean):void {
            this._multiline = value;

            this._setDirty();
        }

        public get multiline():boolean {
            return this._multiline;
        }

        public setFocus() {
            //todo:
            Logger.warning("TextField.setFocus 没有实现");
        }

        constructor() {
            super();
        }

        public _onRemoveFromStage():void {
            super._onRemoveFromStage();

            if (this._type == TextFieldType.INPUT) {
                this._inputUtils._removeStageText();
            }
        }

        public _onAddToStage():void {
            super._onAddToStage();

            if (this._type == TextFieldType.INPUT) {
                this._inputUtils._addStageText();
            }
        }

        public _updateBaseTransform():void {
            super._updateTransform();
        }

        public _updateTransform():void {
            if (this._type == TextFieldType.INPUT) {
                if (this._normalDirty) {//本身有变化
                    this._clearDirty();
                    this._inputUtils._updateProperties();
                }
                else {//兼容可能父层有变化
                    this._inputUtils._updateTransform();
                }
            }
            else {
                this._updateBaseTransform();
            }
        }

        /**
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        public _render(renderContext:RendererContext):void {
            this.drawText(renderContext, false);

            this._clearDirty();
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureBounds():egret.Rectangle {
            var renderContext = egret.MainContext.instance.rendererContext;
            return this.drawText(renderContext, true);
        }

        private _textArr:Array<any> = [];
        /**
         *
         * @param textArr [["text1", {"color":0xffffff, "size":20}], ["text2", {"color":0xff0000, "size":20}]]
         * @private
         */
        public _setTextArray(text2Arr:Array<any>):void {
            var text:string = "";
            for (var i:number = 0; i < text2Arr.length; i++) {
                text += text2Arr[i][0];
                text2Arr[i][0] = this.changeToPassText(text2Arr[i][0]);
            }
            this._text = text;
            this._setMiddleStyle(text2Arr);
        }

        private changeToPassText(text:string):string {
            if (this._displayAsPassword) {
                var passText:string = "";
                for (var i:number = 0, num = text.length; i < num; i++) {
                    switch (text.charAt(i)) {
                        case '\n' :
                            passText += "\n";
                            break;
                        case '\r' :
                            break;
                        default :
                            passText += '*';
                    }
                }
                return passText;
            }
            return text;
        }

        private _setMiddleStyle(text2Arr:Array<any>):void {
            this._textArr = text2Arr;
        }

        private getLinesArr():Array<any> {
            var text2Arr:Array<any> = this._textArr;

            var renderContext = egret.MainContext.instance.rendererContext;

            var linesArr:Array<any> = [];
            var lineW:number = 0;
            var lineH:number = 0;
            var lineCount:number = 0;
            for (var i:number = 0; i < text2Arr.length; i++) {
                var textInfo:Array<any> = text2Arr[i];
                textInfo[1] = textInfo[1] || {};
                lineH = Math.max(lineH, textInfo[1]["size"] || this._size);
                var text:string = textInfo[0].toString();
                var textArr:Array<any> = text.split(/(?:\r\n|\r|\n)/);

                for (var j:number = 0; j < textArr.length; j++) {
                    if (linesArr[lineCount] == null) {
                        linesArr[lineCount] = [];
                        lineW = 0;
                    }

                    renderContext.setupFont(this);
                    var w:number = renderContext.measureText(textArr[j]);
                    if (!this._hasWidthSet) {//没有设置过宽
                        lineW = w;

                        linesArr[lineCount].push([textArr[j], textInfo[1], w]);
                    }
                    else {
                        if (lineW + w < this._explicitWidth) {//在设置范围内
                            linesArr[lineCount].push([textArr[j], textInfo[1], w]);
                            lineW += w;
                        }
                        else {
                            var k:number = 0;
                            var ww:number = 0;
                            var word:string = textArr[j];
                            for (; k < word.length; k++) {
                                w = renderContext.measureText(word.charAt(k));
                                if (lineW + w > this._explicitWidth) {
                                    break;
                                }
                                ww += w;
                                lineW += w;
                            }
                            if (k > 0) {
                                linesArr[lineCount].push([word.substring(0, k), textInfo[1], ww]);
                                textArr[j] = word.substring(k);
                            }

                            j--;
                        }
                    }
                    if (j < textArr.length - 1) {//非最后一个
                        linesArr[lineCount].push([lineW, lineH]);
                        if (this._type == TextFieldType.INPUT && !this._multiline) {
                            return linesArr;
                        }
                        lineCount++;
                    }
                }

                if (i == text2Arr.length - 1) {
                    linesArr[lineCount].push([lineW, lineH]);
                }
            }

            return linesArr;
        }

        /**
         * @private
         * @param renderContext
         * @returns {Rectangle}
         */
        private drawText(renderContext:RendererContext, forMeasure:boolean):Rectangle {

            var lines:Array<any> = this.getLinesArr();
            renderContext.setupFont(this);

            if (!lines) {
                return Rectangle.identity.initialize(0, 0, 0, 0);
            }
            var length:number = lines.length;
            var drawY:number = this._size * 0.5;

            var textHeight:number = 0;
            var maxWidth:number = 0;
            for (var i:number = 0; i < lines.length; i++) {
                var lineArr:Array<any> = lines[i];
                textHeight += lineArr[lineArr.length - 1][1];
                maxWidth = Math.max(lineArr[lineArr.length - 1][0], maxWidth);
            }
            textHeight += (length - 1) * this._lineSpacing;

            if (this._hasWidthSet) {
                maxWidth = this._explicitWidth;
            }

            var explicitHeight:number = this._hasHeightSet?this._explicitHeight:Number.POSITIVE_INFINITY;
            if (this._hasHeightSet&&textHeight < explicitHeight) {
                var valign:number = 0;
                if (this._verticalAlign == VerticalAlign.MIDDLE)
                    valign = 0.5;
                else if (this._verticalAlign == VerticalAlign.BOTTOM)
                    valign = 1;
                drawY += valign * (explicitHeight - textHeight);
            }
            drawY = Math.round(drawY);
            var halign:number = 0;
            if (this._textAlign == HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (this._textAlign == HorizontalAlign.RIGHT) {
                halign = 1;
            }

            var drawX:number = 0;
            for (var i = 0; i < length; i++) {
                var lineArr:Array<any> = lines[i];

                drawX = Math.round((maxWidth - lineArr[lineArr.length - 1][0]) * halign);

                for (var j:number = 0; j < lineArr.length - 1; j++) {
                    if (!forMeasure) {
                        if (this._type == egret.TextFieldType.INPUT) {
                            renderContext.drawText(this, lineArr[j][0], drawX, drawY, lineArr[j][2], {});
                        }
                        else {
                            renderContext.drawText(this, lineArr[j][0], drawX, drawY, lineArr[j][2], lineArr[j][1]);
                        }
                    }
                    drawX += lineArr[j][2];
                }
                drawY += lineArr[lineArr.length - 1][1] + this._lineSpacing;

                if (this._hasHeightSet && drawY - this._size * 0.5 > this._explicitHeight) {
                    break;
                }
            }

            return Rectangle.identity.initialize(0, 0, maxWidth, textHeight);
        }
    }
}