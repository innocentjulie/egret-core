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



module egret
{

	/**
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
	 * @class egret.Endian
	 * @classdesc
	 */
    export class Endian {


		/**
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
		 * @constant {string} egret.Endian.LITTLE_ENDIAN
		 */
        public static LITTLE_ENDIAN:string = "LITTLE_ENDIAN";

		/**
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
		 * @constant {string} egret.Endian.BIG_ENDIAN
		 */
        public static BIG_ENDIAN:string = "BIG_ENDIAN";

    }


	/**
	 * @class egret.ByteArray
	 * @classdesc
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * 内存中的数据是一个压缩字节数组（数据类型的最紧凑表示形式），但可以使用标准数组访问运算符来操作 ByteArray 类的实例。
	 */
    export class ByteArray
    {
		/**
         * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。
         * 下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
		 * @member {number} egret.ByteArray#position
		 */
        public position:number = 0;

		/**
         * ByteArray 对象的长度（以字节为单位）。
         * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧；如果将长度设置为小于当前长度的值，将会截断该字节数组。
		 * @member {number} egret.ByteArray#length
		 */
        public length:number = 0;

        private _mode:string = "";
        private maxlength:number = 0;
        private arraybytes; //ArrayBuffer
        private unalignedarraybytestemp; //ArrayBuffer
        private _endian:string =  Endian.LITTLE_ENDIAN;
        private isLittleEndian:boolean = false;
		/**
         * 默认表示多字节数字的字节顺序的常量
		 * @constant {string} egret.ByteArray.DEFAULT_ENDIAN
		 */
        public static DEFAULT_ENDIAN:string = Endian.BIG_ENDIAN;

        constructor()
        {
            this._mode = "Typed array";
            this.maxlength = 4;
            this.arraybytes = new ArrayBuffer(this.maxlength);
            this.unalignedarraybytestemp = new ArrayBuffer(16);
            this.endian = ByteArray.DEFAULT_ENDIAN;
        }

		/**
         * 更改或读取数据的字节顺序。
         * 请使用egret.Endian.BIG_ENDIAN 或 egret.Endian.LITTLE_ENDIAN表示。
		 * @member {string} egret.ByteArray#endian
		 */
        public get endian():string{
            return this._endian;
        }

        public set endian(value:string){
            this._endian = value;
            this.isLittleEndian = value == Endian.LITTLE_ENDIAN;
        }

		/**
		 * @method egret.ByteArray#ensureWriteableSpace
		 * @param n {number} 
		 */
        public ensureWriteableSpace(n:number)
        {
            this.ensureSpace(n + this.position);
        }

		/**
		 * @method egret.ByteArray#setArrayBuffer
		 * @param aBuffer {egret.ArrayBuffer} 
		 */
        public setArrayBuffer(aBuffer:ArrayBuffer):void
        {
            this.ensureSpace(aBuffer.byteLength);

            this.length = aBuffer.byteLength;

            var inInt8AView:Int8Array = new Int8Array(aBuffer);
            var localInt8View:Int8Array = new Int8Array(this.arraybytes, 0, this.length);

            localInt8View.set(inInt8AView);

            this.position = 0;

        }

		/**
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。【只读】
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
		 * @method egret.ByteArray#getBytesAvailable
		 * @returns {number}
		 */
        public get bytesAvailable():number
        {
            return ( this.length ) - ( this.position );
        }

		/**
		 * @method egret.ByteArray#ensureSpace
		 * @param n {number} 
		 */
        public ensureSpace(n:number):void
        {
            if (n > this.maxlength) {
                var newmaxlength:number = (n + 255) & (~255);
                var newarraybuffer = new ArrayBuffer(newmaxlength);
                var view = new Uint8Array(this.arraybytes, 0, this.length);
                var newview = new Uint8Array(newarraybuffer, 0, this.length);
                newview.set(view);      // memcpy
                this.arraybytes = newarraybuffer;
                this.maxlength = newmaxlength;
            }
        }

		/**
         * 在字节流中写入一个字节。
         * 使用参数的低 8 位。忽略高 24 位。
		 * @method egret.ByteArray#writeByte
		 * @param b {number}  一个 32 位整数。低 8 位将被写入字节流。
         */
        public writeByte(b:number):void
        {
            this.ensureWriteableSpace(1);
            var view = new Int8Array(this.arraybytes);
            view[ this.position++ ] = (~~b); // ~~ is cast to int in js...
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

		/**
         * 从字节流中读取带符号的字节。
         * 返回值的范围是从 -128 到 127。
		 * @method egret.ByteArray#readByte
         * @returns {number} 介于 -128 和 127 之间的整数。
         */
        public readByte():number
        {
            if (this.position >= this.length) {
                throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
            }
            var view = new Int8Array(this.arraybytes);

            return view[ this.position++ ];
        }

		/**
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中。
         * @method egret.ByteArray#readBytes
		 * @param bytes {egret.ByteArray} 要将数据读入的 ByteArray 对象。
		 * @param offset {number} bytes 中的偏移（位置），应从该位置写入读取的数据。
		 * @param length {number} 要读取的字节数。默认值 0 导致读取所有可用的数据。

         */
        public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void
        {
            if (length == null) {
                length = bytes.length;
            }
            bytes.ensureWriteableSpace(offset + length);

            var byteView:Int8Array = new Int8Array(bytes.arraybytes);
            var localByteView:Int8Array = new Int8Array(this.arraybytes);

            byteView.set(localByteView.subarray(this.position, this.position + length), offset);

            this.position += length;

            if (length + offset > bytes.length) {
                bytes.length += ( length + offset ) - bytes.length;
            }

        }

		/**
         * 在字节流中写入一个无符号的字节。
		 * @method egret.ByteArray#writeUnsignedByte
		 * @param b {number} 介于 0 到 255 之间的无符号字节。
		 */
        public writeUnsignedByte(b:number)
        {
            this.ensureWriteableSpace(1);
            var view = new Uint8Array(this.arraybytes);
            view[this.position++] = (~~b) & 0xff; // ~~ is cast to int in js...
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

		/**
         * 从字节流中读取无符号的字节。
         * 返回值的范围是从 0 到 255。
		 * @method egret.ByteArray#readUnsignedByte 介于 0 到 255 之间的无符号字节。
		 */
        public readUnsignedByte()
        {
            if (this.position >= this.length) {
                throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
            }
            var view = new Uint8Array(this.arraybytes);
            return view[this.position++];
        }

		/**
         *在字节流中写入一个无符号的 16 位整数。
		 * @method egret.ByteArray#writeUnsignedShort
		 * @param b {number}  介于 0 到 65535 之间的无符号整数。
		 */
        public writeUnsignedShort(b:number)
        {
            this.ensureWriteableSpace(2);
            if (( this.position & 1 ) == 0) {
                var view = new Uint16Array(this.arraybytes);
                view[ this.position >> 1 ] = (~~b) & 0xffff; // ~~ is cast to int in js...
            } else {
                var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                view[0] = (~~b) & 0xffff;
                var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                view2.set(view3);
            }
            this.position += 2;
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

		/**
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串。
		 * @method egret.ByteArray#readUTFBytes
		 * @param len {number} 指明 UTF-8 字节长度的无符号短整型数。
         * @returns {string} 由指定长度的 UTF-8 字节组成的字符串。
		 */
        public readUTFBytes(len:number):string
        {

            var value:string = "";
            var max:number = this.position + len;
            var data:DataView = new DataView(this.arraybytes);

            // utf8-encode
            while (this.position < max) {

                var c:number = data.getUint8(this.position++);

                if (c < 0x80) {

                    if (c == 0) break;
                    value += String.fromCharCode(c);

                } else if (c < 0xE0) {

                    value += String.fromCharCode(((c & 0x3F) << 6) | (data.getUint8(this.position++) & 0x7F));

                } else if (c < 0xF0) {

                    var c2 = data.getUint8(this.position++);
                    value += String.fromCharCode(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (data.getUint8(this.position++) & 0x7F));

                } else {

                    var c2 = data.getUint8(this.position++);
                    var c3 = data.getUint8(this.position++);

                    value += String.fromCharCode(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (data.getUint8(this.position++) & 0x7F));

                }

            }

            return value;

        }

		/**
         * 从字节流中读取一个带符号的 32 位整数。
         * 返回值的范围是从 -2147483648 到 2147483647。
		 * @method egret.ByteArray#readInt
		 * @returns {number} 介于 -2147483648 到 2147483647 之间的整数。
		 */
        public readInt():number
        {

            var data:DataView = new DataView(this.arraybytes);
            var intNumber:number = data.getInt32(this.position, this.isLittleEndian);

            this.position += 4;

            return intNumber;

        }

		/**
         * 从字节流中读取一个带符号的 16 位整数。
         * 返回值的范围是从 -32768 到 32767。
		 * @method egret.ByteArray#readShort
		 * @returns {number} 介于 -32768 到 32767 之间的整数。
		 */
        public readShort():number
        {

            var data:DataView = new DataView(this.arraybytes);
            var shortNumber:number = data.getInt16(this.position, this.isLittleEndian);

            this.position += 2;
            return shortNumber;

        }

		/**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数。
		 * @method egret.ByteArray#readDouble
		 * @returns {number} 返回双精度（64 位）浮点数。
		 */
        public readDouble():number
        {
            var data:DataView = new DataView(this.arraybytes);
            var doubleNumber:number = data.getFloat64(this.position, this.isLittleEndian);

            this.position += 8;
            return doubleNumber;

        }

		/**
         * 从字节流中读取一个无符号的 16 位整数。
         * 返回值的范围是从 0 到 65535。
		 * @method egret.ByteArray#readUnsignedShort
         * @returns {number} 介于 0 到 65535 之间的无符号整数。
		 */
        public readUnsignedShort():number
        {
            if (this.position > this.length + 2) {
                throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
            }
            if (( this.position & 1 ) == 0) {
                var view = new Uint16Array(this.arraybytes);
                var pa:number = this.position >> 1;
                this.position += 2;
                return view[pa];
            } else {
                var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                view3.set(view2);
                this.position += 2;
                return view[0];
            }
        }

		/**
         * 在字节流中写入一个无符号的 32 位整数。
		 * @method egret.ByteArray#writeUnsignedInt
		 * @param b {number} 介于 0 和 4294967295 之间的无符号整数。
         */
        public writeUnsignedInt(b:number)
        {
            this.ensureWriteableSpace(4);
            if (( this.position & 3 ) == 0) {
                var view = new Uint32Array(this.arraybytes);
                view[ this.position >> 2 ] = (~~b) & 0xffffffff; // ~~ is cast to int in js...
            } else {
                var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                view[0] = (~~b) & 0xffffffff;
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view2.set(view3);
            }
            this.position += 4;
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

		/**
         * 从字节流中读取一个无符号的 32 位整数。
         * 返回值的范围是从 0 到 4294967295。
		 * @method egret.ByteArray#readUnsignedInt
         *  @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数。
         */
        public readUnsignedInt():number
        {

            if (this.position > this.length + 4) {
                throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
            }
            if (( this.position & 3 ) == 0) {
                var view = new Uint32Array(this.arraybytes);
                var pa:number = this.position >> 2;
                this.position += 4;
                return view[ pa ];
            } else {
                var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view3.set(view2);
                this.position += 4;
                return view[0];
            }
        }

		/**
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数。
		 * @method egret.ByteArray#writeFloat
		 * @param b {number} 单精度（32 位）浮点数。
		 */
        public writeFloat(b:number)
        {
            this.ensureWriteableSpace(4);
            if (( this.position & 3 ) == 0) {
                var view = new Float32Array(this.arraybytes);
                view[ this.position >> 2 ] = b;
            } else {
                var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                view[0] = b;
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view2.set(view3);
            }
            this.position += 4;
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

		/**
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数。
		 * @method egret.ByteArray#readFloat
         * @returns {number} 单精度（32 位）浮点数。
		 */
        public readFloat():number
        {
            if (this.position > this.length + 4) {
                throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
            }
            if ((this.position & 3) == 0) {
                var view = new Float32Array(this.arraybytes);
                var pa = this.position >> 2;
                this.position += 4;
                return view[pa];
            } else {
                var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view3.set(view2);
                this.position += 4;
                return view[ 0 ];
            }
        }
    }
}