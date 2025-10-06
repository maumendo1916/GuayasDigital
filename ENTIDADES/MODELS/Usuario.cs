using System;

namespace ENTIDADES.MODELS
{
   
    public class Usuario
    {

        public long IdEmpresa { get; set; }
        public string IdUsuario { get; set; }
        public char USTipo { get; set; }
        public string USClave { get; set; }
        public string USDescrip { get; set; }
        public char USEstado { get; set; }
        public DateTime? USFechaCadu { get; set; }
        public bool USNuevo { get; set; }
        public bool USGrabar { get; set; }
        public bool USEliminar { get; set; }
        public bool USAbrir { get; set; }
        public bool USModCtaInv { get; set; }
        public bool USModCtaFac { get; set; }
        public bool USModCtaCom { get; set; }
        public bool USModCtaCar { get; set; }
        public bool USModBenefi { get; set; }
        public bool USPrecioFin { get; set; }
        public bool USVerCosto { get; set; }
        public bool USModCosto { get; set; }
        public int USTipoPrecio { get; set; }
        public int USPredCost { get; set; }
        public string USMail { get; set; }
        public long? IdPuntoVenta { get; set; }
        public bool ModPuntoVenta { get; set; }
        public string IdBodega { get; set; }
        public bool USModBodega { get; set; }
        public bool USBI { get; set; }
        public bool USFlujo { get; set; }
        public bool USBtnGrabar { get; set; }
        public bool USVerUtilidad { get; set; }
        public string IdTDCodFact1 { get; set; }
        public string IdTDCodFact2 { get; set; }
        public string IdTDCodDev1 { get; set; }
        public string IdTDCodNC1 { get; set; }
        public string IdTDCodRec1 { get; set; }
        public string IdTDCodAnt1 { get; set; }
        public string IdTDCodTraRec1 { get; set; }
        public string IdTDCodEgre1 { get; set; }
        public string IdTDCodEgreAnt { get; set; }
        public string IdTDCodTraEgreAnt { get; set; }
        public string IdTDCodCotiza { get; set; }
        public string IdUsuarioCrea { get; set; }
        public string IdUsuarioModi { get; set; }
        public DateTime USFechaCrea { get; set; }
        public DateTime? USFechaModi { get; set; }
        public long IdxRowId { get; set; }
        public string IdLocal { get; set; }
        public string IdTDOtroSegre { get; set; }
        public string IdTDEgresoConsu { get; set; }
        public string IdTDEgresoVta { get; set; }
        public int? USNivelPrecio { get; set; }
        public bool USPlanchas { get; set; }
        public string IdCamarero { get; set; }
        public string IMEI { get; set; }
        
    }

}
