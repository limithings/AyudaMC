// data.js

// 1. Contraseñas de equipos (From User)
const defaultPasswords = [
    { id: 1, team: "PLQ 1 y 2", user: "ADMIN", pass: "ADMIN", order: 1 },
    { id: 2, team: "CRAI", user: "CONTROL", pass: "111", order: 2 },
    { id: 3, team: "TALPA", user: "CONTROL", pass: "111", order: 3 },
    { id: 4, team: "TABLET TALPA", user: "CONTROL", pass: "Tirme2", order: 4 },
    { id: 5, team: "Pc AUXILIAR", user: "METACOMPOST", pass: "Tirme2022", order: 5 },
    { id: 6, team: "Pc control", user: "CONTROL", pass: "Tircon2020", order: 6 },
    { id: 7, team: "Pc cámaras", user: "CCTV-O-70", pass: "105060", order: 7 },
    { id: 8, team: "Pc MOTOR", user: "", pass: "roncero", order: 8 },
    { id: 9, team: "Pc CONTRA INCENDIOS CONTROL", user: "", pass: "1234", order: 9 },
    { id: 10, team: "Pc CONTROL PRESELECCIÓN", user: "CONTROL", pass: "Tirme2", order: 10 },
    { id: 11, team: "Pc CÁMARAS PRESELECCIÓN", user: "CCTV-O-50", pass: "1111", order: 11 },
    { id: 12, team: "Pc DATOS PRESELECCIÓN", user: "PRESELECCIÓN", pass: "TIRME2912", order: 12 },
    { id: 13, team: "ALARMA OFICINA P.S.S.", user: "", pass: "5459# AWAY ( activa y desactiva )", order: 13 },
    { id: 14, team: "PLQ1 P.S.S", user: "MOEC", pass: "2008", order: 14 },
    { id: 15, team: "PLQ2 P.S.S.", user: "CONTROL", pass: "111", order: 15 },
    { id: 16, team: "PC CÁMARAS DE VIGILANCIA P.S.S", user: "CCTV-0-40", pass: "4040", order: 16 },
    { id: 17, team: "SALA DE BOMBAS P.S.S.", user: "MASTER", pass: "123456", order: 17 },
    { id: 18, team: "HUMBOLDT (CCM)", user: "tirme", pass: "2025", order: 18 },
    { id: 19, team: "HUMBOLDT (ESTACIÓN FLOCULANTE )", user: "tirme", pass: "1000", order: 19 },
    { id: 20, team: "WIFITIRME", user: "", pass: "Jeutccslc1d", order: 20 },
    { id: 21, team: "WIFIINVITADOS", user: "", pass: "Compost2019!", order: 21 },
    { id: 22, team: "CENTRIFUGA 3", user: "Su", pass: "2468", order: 22 },
    { id: 23, team: "PC ENTRADA CAMIONES", user: "VIDMAR", pass: "vidmar", order: 23 },
    { id: 24, team: "Estación floculante C3", user: "1234", pass: "1234", order: 24 },
    { id: 25, team: "Pc Depuradora programa", user: "", pass: "3d@rTirme", order: 25 },
    { id: 26, team: "pc depuradora xp", user: "Administrador", pass: "roncero", order: 26 },
    { id: 27, team: "PC Control de puertas(CONTROLSOFT)", user: "control", pass: "control", order: 27 },
    { id: 28, team: "parámetros alimentación lodos y fracción vegetal", user: "siemsa", pass: "siemsa", order: 28 },
    { id: 29, team: "CONTROL SECADO SOLAR", user: "", pass: "tirme2", order: 29 },
    { id: 30, team: "PC CONTROL DEPURADORA", user: "admin", pass: "admin", order: 30 },
    { id: 31, team: "PC ENVASES CONTRAINCENDIOS", user: "operador", pass: "1234", order: 31 },
    { id: 32, team: "NUEVA ESTACIÓN FLOCULANTE C1", user: "service", pass: "5555", order: 32 },
    { id: 33, team: "61-SU-003", user: "Supervisor", pass: "2025", order: 33 }
];

// 2. Consumibles (From Prompt)
const defaultConsumables = [
    { code: "0000001500923", desc: "ACEITE GIRASOL (GARRAFA 25L)" },
    { code: "0000001500924", desc: "ACEITE SEMILLAS (GARRAFA 5L)" },
    { code: "0000001500925", desc: "POLIELECTROLITO FLOERGER TE 4800 SSH Floculante centrifuga 1 y 2 (1 palet- 20 unidades)" },
    { code: "0000001500926", desc: "BIG BAG DE FLOCULANTE CENTRÍFUGA 3" },
    { code: "0000001500927", desc: "INHIBIDOR INCRUSTACIÓN INCUS-CTR/3( OBSOLETO )" },
    { code: "0000001500928", desc: "INHIB. CORROSIÓN HAVOLINE XLI ( 200 L)" },
    { code: "0000001500929", desc: "REFRIG TEXACO HAVOLINE HLC+B1 OF02 NARAN" },
    { code: "0000001500930", desc: "ADITIVO ADBLUE 10L" },
    { code: "0000001500931", desc: "HIPOCLORITO SÓDICO 75 G/L (1.000 L)" },
    { code: "0000001500932", desc: "CLORURO DE BENZALCONIO Q-50 (GRG)" },
    { code: "0000001500933", desc: "ANTIESPUMANTE SNF FOAM OIL 22 V (GRG) /ANTIESP. C1 ,C2 Y D1" },
    { code: "0000001500934", desc: "SOSA CAUSTICA 25% (HIDROX. SODICO) GRG" },
    { code: "0000001500935", desc: "ABSORBENTE GRANULADO 20KG (Sacos de secante) (1 UN)" },
    { code: "0000001500936", desc: "ANTIICRUSTANTE FLOSPERSE3000" },
    { code: "0000001502386", desc: "ANTIESPUMANTE TEFLOC AF 120 (GRG) - Antiespumante reactor aerobio DEPURADORA" },
    { code: "0000001502383", desc: "ACIDO CITRICO LIMPIEZA CALLES ULTRAFILTRACION (25 L)" },
    { code: "0000001502384", desc: "CHEMIPOL WT 657 (GRG 1000L) ANTIINCRUSTANTE EDAR" },
    { code: "0000001502454", desc: "LIQUICUT E-64 (SACO 22,5Kg)" },
    { code: "6020900000084", desc: "HIPOCLORITO SODICO LIMPIEZA CALLES (25 L)" },
    { code: "0000001204669", desc: "DIFUSORES PREHUMIFICADOR" },
    { code: "0000001501342", desc: "BICARBONATO SODICO (SACO 25 KG)" },
    { code: "6020800000068", desc: "PI_MONO DESECHABLE PROTEC. QUIMICA T:XL" },
    { code: "1000000102507", desc: "BARRERA ABSORBENTE QUÍMICO 120*7,5C" },
    { code: "1000000102511", desc: "COJINES ABSORCIÓN QUÍMICOS 40*52C" },
    { code: "6020800000058", desc: "EPI GAFA ESTANCA" },
    { code: "6020800000007", desc: "EPI GUANTE PROTECCION QUIMICA DER." },
    { code: "0000001500439", desc: "EPI_GUANTE NITRILO DESECHABLE TALLA: XL (CAJA)" },
    { code: "6020800000021", desc: "EPI GUANTE NITRILO DESECHABLE TALLA L" },
    { code: "6020502000014", desc: "EPI_GUANTE NITRILO DESECHABLE TALLA M" },
    { code: "6020800000074", desc: "Guantes químicos largos (los azules que llegan hasta el sobaco)" },
    { code: "6020800000035", desc: "EPI_PANTALLA FACIAL" },
    { code: "1000000102506", desc: "HOJAS ABSORCION QUIMICOS 40X50 CP101" },
    { code: "0000001500109", desc: "TRAJE AGUA REFRECTANTE" },
    { code: "xxxxxxxxxxxxxxx", desc: "ACEITE CEPSA CIRCULANTE 220 ( 208 L COMPRESOR 3" },
    { code: "6020400000081", desc: "ACEITE CEPSA SUPER SERIE 3 SAE 40 200L COMPRESORES BIOGAS 1 Y 2" },
    { code: "0000001500694", desc: "ACEITE CEPSA TRONCOIL GAS D 40 (1000 L) \"MOTORES BIOGAS\"" },
    { code: "6020400000081", desc: "ACEITE CEPSA SUPER SERIE 3 SAE 40 200L" },
    { code: "1000000103953", desc: "GRASA CEPSA ARGA 0,4 KG" },
    { code: "0000001208880", desc: "GRASA GEA CARTUCHO 0,4-KG (GRASA CENTRIFUGA 3)" },
    { code: "6020400000033", desc: "SPRAY AFLOJATODO (WD-40)" },
    { code: "0000001502152", desc: "GRASA K NATE , PARA PANZER" },
    { code: "6020300000242", desc: "FILTRINA" },
    { code: "6020300000094", desc: "BOMBA ENGRASE" },
    { code: "6020300000541", desc: "MANGUITO BOMBA ENGRASE" },
    { code: "1000000104820", desc: "LATIGUILLO ENGRASE" },
    { code: "1000000101095", desc: "SILENCIADOR NEUMATICO 1'' ROSCA GAS ATMO (tanque limpieza equipos)" },
    { code: "6292000010346", desc: "BOLIGRAFO PLUS SOFT 0.7MM AZUL 25 unidades" },
    { code: "0000001501606", desc: "ETIQUETAS PARA DESCARGOS AMARILLAS (LA CAJA SON 1000 UNIDADES)" },
    { code: "0000001501605", desc: "ETIQUETAS PARA DESCARGOS ROJAS (LA CAJA SON 2000 UNIDADES)" },
    { code: "6292000010367", desc: "CINTA DYMO LETRATAG NEGRO/BLANCO (CARRETE PARA EL DYMO)" },
    { code: "0000001501499", desc: "ROLLO ETIQUETA ADHESIVA 76*51 DESCARGOS ZEBRA" },
    { code: "6292000010390", desc: "POST-IT BLOC DE NOTAS ADHESIVO" },
    { code: "6292000010337", desc: "CELO MAGIC TAPE (ROLLOS) REF: 810/19" },
    { code: "0000001500431", desc: "ROLLO PAPEL TERMICO 80*80 ALBARÁN (BÁSCULA)" },
    { code: "0000001500023", desc: "RIBBON RESINA TOMER PARA ZEBRA ZT410" },
    { code: "6020300000066", desc: "TUBO PEGAMENTO LOCTITE 401 (SUPER GLUE)" },
    { code: "6292000010369", desc: "CLIPS Nº 1 1/2 (CAJA 100 UDS.)REF: UM 01" },
    { code: "6292000010390", desc: "POST-IT 76X76MM SURTIDO" },
    { code: "6292000010338", desc: "IPP-EX (RATON) EL TIPEX DE TODA VIDA, DE SIEMPRE" },
    { code: "1000000100381", desc: "PINZA EMISORA" },
    { code: "6292000010343", desc: "GRAPADORA PETRUS" },
    { code: "6292000010362", desc: "PAPEL DINA4 BLANCO ECOLOG. (500 HOJAS) FOLIOS PARA LA IMPRESORA" },
    { code: "1000000102951", desc: "CINTA ADHESIVA DOBLE CARA 50MM" },
    { code: "6020300000072", desc: "ROLLO PRECINTO TRANSPARENTE PARA EMBALAR" },
    { code: "0000001204669", desc: "INYECTOR PROMAX QPAA-15W SCRUBBER BIOFILTRO" },
    { code: "6020700000051", desc: "PILA TAMPON 1,5V LR03-AAA ALC" },
    { code: "6020700000050", desc: "PILA TAMPÓN 1,5V LR06 AA ALC" },
    { code: "1000000101538", desc: "PILA BOTON" },
    { code: "6020200000015", desc: "BATERIA KNB-55L PARA TK-3160/3360 (EMISORA KENWOOD)" },
    { code: "6020700000075", desc: "BRIDAS NEGRAS PLASTICO 2.5 X 98 ( 1 UN)" },
    { code: "6020700000076", desc: "BRIDAS NEGRAS PLASTICO 3.6 X 200 ( 1 UN)" },
    { code: "6020700000077", desc: "BRIDAS NEGRAS PLASTICO 7.8 X 365 ( 1 UN)" },
    { code: "6020700000078", desc: "BRIDAS NEGRAS PLASTICO 7.8 X 750 ( 1 UN)" },
    { code: "6020700000079", desc: "BRIDAS NEGRAS PLASTICO 7.8 X 300 ( 1 UN)" },
    { code: "6020700000080", desc: "BRIDAS NEGRAS PLASTICO 4.8 X 290 ( 1 UN)" },
    { code: "6020700000081", desc: "BRIDAS NEGRAS PLASTICO 4.8 X 200 ( 1 UN)" },
    { code: "1000000104192", desc: "JUNTA GOMA P/ RACOR KAMLOCK 1'' TIPO B" },
    { code: "1000000104233", desc: "JUNTA GOMA P/ RACOR KAMLOCK 2'' NBR" },
    { code: "1000000103354", desc: "BOMBA ACHIQUE KARCHER SDP 9500 450W" },
    { code: "6020500000020", desc: "BOTE MUESTRAS CUADRADO 2LTOS" },
    { code: "6020500000036", desc: "FRASCO DUQUESA 1000ml 1 CAJA (50 UNIDADES) BOTES PARA RECOGER xxxxxxxxxxxxxxx MUESTRAS DE 1 LITRO (REDONDO)" },
    { code: "0000001500023", desc: "ribon resina 83mm 450m ROLLO NEGRO PARA IMPRESORA ZEBRA" },
    { code: "1000000102893", desc: "FILTRO GAS REF DEUTZ 12213514" },
    { code: "1000000103751", desc: "ASPERSOR 'SPRINKLERS' NAAN 7110 128L/H" },
    { code: "6020400000037", desc: "ANTICONGELANTE 50 POR 100 (5 LTS) (anticongelante para las palas)" },
    { code: "6020200000004", desc: "ANTENA EMISORA TK3160" },
    { code: "1000000103338", desc: "BATERIA MANDO A DISTANCIA CRAI" },
    { code: "6020800000006", desc: "CINTA BALIZAR" },
    { code: "0000001210093", desc: "FILTRO MALLA 600 MICAS" },
    { code: "6020300000019", desc: "CINTA AMERICANA" },
    { code: "60208000000041", desc: "EPI PROTECTOR AUDITIVO TAPON" },
    { code: "00000001500591", desc: "EXAIR A/TDS BIOTHYS PERFUME (para camión agua)" },
    { code: "6020400000033", desc: "SPRAY AFLOJATODO ANTI-RUST 500ML El famoso WD-40" },
    { code: "6020300000086", desc: "MANGUERA RYLSOL MULTI AZUL 1 PULGADA 25X33" },
    { code: "6020300000218", desc: "RACORD KAMLOCK HM 1 PULGADA TIPO B INOX" },
    { code: "6020300000219", desc: "RACORD KAMLOCK M-T 25MM TIPO E INOX MACHO" },
    { code: "6020300000050", desc: "ABRAZADERAS 20X32 SERIE SREF:10.801" },
    { code: "6020300000073", desc: "ROLLO PRECINTO CON ANAGRAMA TIRME" },
    { code: "1000000102716", desc: "ENCLAVAMIENTO PALANCA P/3 CANDADOS" },
    { code: "0000001204622", desc: "ENCLAVAMIENTO GV2 (GANCHOS PARA CANDADOS)" },
    { code: "6020810000014", desc: "SUERO FISIOLOGICO MONODOSIS 5ml (Colirio para los ojos)" },
    { code: "1000000102717", desc: "ENCLAVAMIENTO MERLIN GERIN (BLOQUEO AMARILLO PARA CANDADOS)" },
    { code: "1000000102587", desc: "ARCHIVADOR PARA ARCHIVAR LOS DESCARGOS CERRADOS" },
    { code: "00000001400223", desc: "CUCHILLO SIERRA BAHCO FLOAT ( ABRIR SACOS)" },
    { code: "0000001502184", desc: "ANTIESPUMANTE NALCO 71130 (GRG 900kg) DI-2 DI-3" },
    { code: "0000001400423", desc: "LLAVE UNIVERSAL CONTADORES ELECTRICOS" },
    { code: "6020300000262", desc: "MOSQUETON INOX LARGO 80MM" },
    { code: "0000001502673", desc: "BOLSA FILTRANTE SENTINEL (FILTRO AGUA LIMPIEZA fASE 3 PRESELECCION)" },
    { code: "0000001208769", desc: "FILTRO ASPIRADOR ESTACIONES POLI C1, C3, C4." },
    { code: "0000001501680", desc: "CAJA ETIQUETAS A4 APLI 1209 38X21 .2 ADHE (para bote de muestras)" },
    { code: "0000001502377", desc: "CARBON ACTIVO SA62 (BIGBAG 500KG) Motores Biogas" },
    { code: "100000100404", desc: "Machon de latón 1,5\"" }
];

// 3. Mi Zona (From Prompt)
const defaultMyZone = [
    { service: "Succes", user: "asanchezb", pass: "tirme.metacompost" },
    { service: "Sap", user: "asanb", pass: "Tirme2025!" },
    { service: "Trust", user: "asanchezb", pass: "0630" }
];

// 4. Avisos (New)
const defaultAvisos = [
    { id: 1, equipo: "51-CT-A08", problema: "Rodillo roto", coment: "Comprobar", fecha: "2026-01-27 10:00" }
];

// 5. Tareas (New)
const defaultTareas = [
    { id: 1, tarea: "Atasco", tiempo: "2H", inicio: "15:00", fecha: "2026-01-27" }
];

// 6. OT Consumibles (New)
const defaultOTConsumables = [
    { id: 1, name: "Metacompost", code: "656986", order: 1 },
    { id: 2, name: "D1", code: "656987", order: 2 },
    { id: 3, name: "D2", code: "635875", order: 3 },
    { id: 4, name: "Plq", code: "635889", order: 4 },
    { id: 5, name: "Centrifugas 1 y 2", code: "689885", order: 5 },
    { id: 6, name: "Motor", code: "6987585", order: 6 },
    { id: 7, name: "Depuradora", code: "6958722", order: 7 }
];

// 7. Recuerdos (New)
const defaultRecuerdos = [];

// 8. Diccionario (New)
const defaultDiccionario = [
    { id: 1, name: "Alimentador A preselección", tag: "51-AL-A01", desc: "El primer equipo de toda la línea A de preselección después del puente grua" },
    { id: 2, name: "Cinta preselección", tag: "51-CT-002", desc: "La cinta de rechazo común después de los tromeles de preselección" }
];
