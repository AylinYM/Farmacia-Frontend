export class Producto {

    constructor({
        id = null,
        codigo = "",
        nombre = "",
        categoria = "",
        principioActivo = "",
        concentracion = "",
        presentacion = "",
        laboratorio = "",
        precio = 0,
        stock = 0,
        fechaVencimiento = "",
        descuento = 0,
        imagen = "",
        descripcion = ""
    } = {}) {

        this.id = id;
        this.codigo = String(codigo ?? "");
        this.nombre = String(nombre ?? "");
        this.categoria = String(categoria ?? "");
        this.principioActivo = String(principioActivo ?? "");
        this.concentracion = String(concentracion ?? "");
        this.presentacion = String(presentacion ?? "");
        this.laboratorio = String(laboratorio ?? "");
        this.precio = Number(precio) || 0;
        this.stock = Number(stock) || 0;
        this.fechaVencimiento = String(fechaVencimiento ?? "");
        this.descuento = Number(descuento) || 0;
        this.imagen = String(imagen ?? "");
        this.descripcion = String(descripcion ?? "");
    }

    get precioFinal() {
        return this.precio - (this.precio * this.descuento / 100);
    }

    get tieneStockBajo() {
        return this.stock < 10;
    }

    get estaVencido() {
        if (!this.fechaVencimiento) {
            return false;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const vencimiento = new Date(`${this.fechaVencimiento}T00:00:00`);
        return vencimiento < hoy;
    }

    get estaProximoAVencer() {
        if (!this.fechaVencimiento || this.estaVencido) {
            return false;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const vencimiento = new Date(`${this.fechaVencimiento}T00:00:00`);
        const diferencia = vencimiento.getTime() - hoy.getTime();
        const dias = diferencia / (1000 * 60 * 60 * 24);

        return dias <= 30;
    }

    get estadoVencimiento() {
        if (this.estaVencido) {
            return "vencido";
        }

        if (this.estaProximoAVencer) {
            return "proximo";
        }

        return "vigente";
    }
}
