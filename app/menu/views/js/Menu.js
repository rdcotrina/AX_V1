var Menu_ = function() {

    /*cargar requires*/
    try{
        axExe.require({
            menu: 'MenuScript'
        });
    }catch (ex){
        auditoria.logErrors(ex);
    }
    

    var _private = {};

    _private.config = {
        modulo: 'menu/Menu/'
    };

    _private.idDominio = 0;

    _private.idModulo = 0;

    _private.idMenuPrincipal = 0;

    _private.idOpcion = 0;

    var _public = {};

    _public.main = function() {
        try {
            axScript.addTab({
                id: tabs.T3,
                label: axExe.getTitle(),
                fnCallback: function() {
                    Menu.index(axExe.getRoot());
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.index = function(root) {
        try {
            axAjax.send({
                dataType: 'html',
                root: _private.config.modulo,
                fnServerParams: function(sData) {
                    sData.push({name: '_rootTitle', value: root});
                },
                fnCallback: function(data) {
                    $('#' + tabs.T3 + '_CONTAINER').html(data);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*listado de dominios*/
    _public.getListaDominios = function() {
        try {
            axAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'dominios',
                fnCallback: function(data) {
                    $('.cont-listadominios').html(data);
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getNuevoDominio = function() {
        try {
            axAjax.send({
                element: '#' + tabs.T3 + 'btnNew',
                dataType: 'html',
                root: _private.config.modulo + 'formNuevoDominio',
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formNuevoDominio').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getFormNewModulo = function(idDominio) {
        try {
            _private.idDominio = idDominio; 
            axAjax.send({
                gifProcess: true,
                dataType: 'html',
                root: _private.config.modulo + 'formNuevoModulo',
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formNuevoModulo').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.getFormNewMenu = function(idModulo) {
        try {
            _private.idModulo = idModulo;
            axAjax.send({
                gifProcess: true,
                dataType: 'html',
                root: _private.config.modulo + 'formNewMenu',
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formNewMenu').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*dominio a editar*/
    _public.getFormEditDominio = function() {
        try {
            _private.idDominio = axScript.getParam(arguments[0]);

            axAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'formEditDominio',
                fnServerParams: function(sData) {
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formEditDominio').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*modulo a editar*/
    _public.getFormEditModulo = function() {
        try {
            _private.idModulo = axScript.getParam(arguments[0]);
            _private.idDominio = axScript.getParam(arguments[1]);

            axAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'formEditModulo',
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formEditModulo').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    /*menu principal a editar*/
    _public.getFormEditMenu = function() {
        try {
            _private.idMenuPrincipal = axScript.getParam(arguments[0]);
            _private.idModulo = axScript.getParam(arguments[1]);

            axAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'formEditMenu',
                fnServerParams: function(sData) {
                    sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formEditMenu').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.getFormNewOpcion = function(){
        try {
            _private.idMenuPrincipal = axScript.getParam(arguments[0]);

            axAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'formNewOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formNewOpcion').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.getFormEditOpcion = function() {
        try {
            _private.idOpcion = axScript.getParam(arguments[0]);
            _private.idMenuPrincipal = axScript.getParam(arguments[1]);

            axAjax.send({
                dataType: 'html',
                gifProcess: true,
                root: _private.config.modulo + 'formEditOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_idOpcion', value: _private.idOpcion});
                },
                fnCallback: function(data) {
                    $('#cont-modal').append(data);  /*los formularios con append*/
                    $('#' + tabs.T3 + 'formEditOpcion').modal('show');
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postNewDominio = function() {
        try {
            axAjax.send({
                flag: 1,
                element: '#' + tabs.T3 + 'btnGrabaDominio',
                root: _private.config.modulo + 'postNewDominio',
                form: '#' + tabs.T3 + 'formNuevoDominio',
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                Menu.getListaDominios();
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.DOMSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        axScript.notify.error({
                            content: lang.mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEditarDominio = function() {
        try {
            axAjax.send({
                flag: 2,
                element: '#' + tabs.T3 + 'btnEditaDominio',
                root: _private.config.modulo + 'postEditDominio',
                form: '#' + tabs.T3 + 'formEditDominio',
                fnServerParams: function(sData) {
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                _private.idDominio = 0;
                                Menu.getListaDominios();
                                axScript.closeModal('#' + tabs.T3 + 'formEditDominio');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.DOMSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        axScript.notify.error({
                            content: lang.mensajes.MSG_6
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postDeleteDominio = function() {
        try {
            var idDominio = axScript.getParam(arguments[0]);

            axScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    axAjax.send({
                        flag: 3,
                        gifProcess: true,
                        root: _private.config.modulo + 'deleteDominio',
                        fnServerParams: function(sData) {
                            sData.push({name: '_idDominio', value: idDominio});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                axScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        Menu.getListaDominios();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postNewModulo = function() {
        try {
            axAjax.send({
                flag: 1,
                element: '#' + tabs.T3 + 'btnGrabaModulo',
                root: _private.config.modulo + 'postNewModulo',
                form: '#' + tabs.T3 + 'formNuevoModulo',
                fnServerParams: function(sData) {
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                _private.idDominio = 0;
                                Menu.getListaDominios();
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.MODSI
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEditModulo = function() {
        try {
            axAjax.send({
                flag: 2,
                element: '#' + tabs.T3 + 'btnEditarModulo',
                root: _private.config.modulo + 'postEditModulo',
                form: '#' + tabs.T3 + 'formEditModulo',
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                    sData.push({name: '_idDominio', value: _private.idDominio});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                Menu.getListaDominios();
                                _private.idModulo = 0;
                                _private.idDominio = 0;
                                axScript.closeModal('#' + tabs.T3 + 'formEditModulo');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.MODSI
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postDeleteModulo = function() {
        try {
            var id = axScript.getParam(arguments[0]);

            axScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    axAjax.send({
                        flag: 3,
                        gifProcess: true,
                        root: _private.config.modulo + 'postDeleteModulo',
                        fnServerParams: function(sData) {
                            sData.push({name: '_idModulo', value: id});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                axScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        Menu.getListaDominios();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postNewMenu = function() {
        try {
            axAjax.send({
                flag: 1,
                element: '#' + tabs.T3 + 'btnGrabaMenuPri',
                root: _private.config.modulo + 'postNewMenu',
                form: '#' + tabs.T3 + 'formNewMenu',
                fnServerParams: function(sData) {
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                Menu.getListaDominios();
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.MNUSI
                        });
                    } 
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEditarMenu = function() {
        try {
            axAjax.send({
                flag: 2,
                element: '#' + tabs.T3 + 'btnEditarMenuPri',
                root: _private.config.modulo + 'postEditMenu',
                form: '#' + tabs.T3 + 'formEditMenu',
                fnServerParams: function(sData) {
                    sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
                    sData.push({name: '_idModulo', value: _private.idModulo});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                Menu.getListaDominios();
                                _private.idMenuPrincipal = 0;
                                _private.idModulo = 0;
                                axScript.closeModal('#' + tabs.T3 + 'formEditMenu');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.MNUSI
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postDeleteMenu = function() {
        try {
            var id = axScript.getParam(arguments[0]);

            axScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    axAjax.send({
                        flag: 3,
                        gifProcess: true,
                        root: _private.config.modulo + 'postDeleteMenu',
                        fnServerParams: function(sData) {
                            sData.push({name: '_idMenuPrincipal', value: id});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                axScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        Menu.getListaDominios();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.postNewOpcion = function() {
        try {
            axAjax.send({
                flag: 1,
                element: '#' + tabs.T3 + 'btnGrabaOPC',
                root: _private.config.modulo + 'postNewOpcion',
                form: '#' + tabs.T3 + 'formNewOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                Menu.getListaDominios();
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.OPCSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        axScript.notify.error({
                            content: lang.confMenu.ALISI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 4) {
                        axScript.notify.error({
                            content: lang.confMenu.URLSI
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postEditOpcion = function() {
        try {
            axAjax.send({
                flag: 2,
                element: '#' + tabs.T3 + 'btnEDOPC',
                root: _private.config.modulo + 'postEditOpcion',
                form: '#' + tabs.T3 + 'formEditOpcion',
                fnServerParams: function(sData) {
                    sData.push({name: '_idOpcion', value: _private.idOpcion});
                    sData.push({name: '_idMenuPrincipal', value: _private.idMenuPrincipal});
                },
                fnCallback: function(data) {
                    if (!isNaN(data.result) && parseInt(data.result) === 1) {
                        axScript.notify.ok({
                            content: lang.mensajes.MSG_3,
                            callback: function() {
                                Menu.getListaDominios();
                                _private.idOpcion = 0;
                                _private.idMenuPrincipal = 0;
                                axScript.closeModal('#' + tabs.T3 + 'formEditOpcion');
                            }
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 2) {
                        axScript.notify.error({
                            content: lang.confMenu.OPCSI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 3) {
                        axScript.notify.error({
                            content: lang.confMenu.ALISI
                        });
                    } else if (!isNaN(data.result) && parseInt(data.result) === 4) {
                        axScript.notify.error({
                            content: lang.confMenu.URLSI
                        });
                    }
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.postDeleteOpcion = function() {
        try {
            var id = axScript.getParam(arguments[0]);

            axScript.notify.confirm({
                content: lang.mensajes.MSG_5,
                callbackSI: function() {
                    axAjax.send({
                        flag: 3,
                        gifProcess: true,
                        root: _private.config.modulo + 'postDeleteOpcion',
                        fnServerParams: function(sData) {
                            sData.push({name: '_idOpcion', value: id});
                        },
                        fnCallback: function(data) {
                            if (!isNaN(data.result) && parseInt(data.result) === 1) {
                                axScript.notify.ok({
                                    content: lang.mensajes.MSG_6,
                                    callback: function() {
                                        Menu.getListaDominios();
                                    }
                                });
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.postOrdenar = function() {
        try {
            var tipo = axScript.getParam(arguments[0]);
            var ids = axScript.getParam(arguments[1]);

            switch (tipo) {
                case 'DOM': /*ordenear modulos*/
                    Menu.postSortDominios(ids);
                    break;
                case 'MOD': /*ordenear modulos*/
                    Menu.postSortModulos(ids);
                    break;
                case 'MNU': /*ordenear menu principal*/
                    Menu.postSortMenu(ids);
                    break;
                case 'OPC': /*ordenear opciones*/
                    Menu.postSortOpciones(ids);
                    break;
            }
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postSortDominios = function() {
        try {
            var ids = axScript.getParam(arguments[0]);
            var textoAreaDividido = ids.split(",");
            var numeroPalabras = textoAreaDividido.length;

            axAjax.send({
                flag: 4,
                fnServerParams: function(sData) {
                    sData.push({name: tabs.T3 + 'txt_dominio', value: ids});
                    sData.push({name: '_lengthArray', value: numeroPalabras});
                },
                root: _private.config.modulo + 'postSortDominio'
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postSortModulos = function() {
        try {
            var ids = axScript.getParam(arguments[0]);
            var textoAreaDividido = ids.split(",");
            var numeroPalabras = textoAreaDividido.length;

            axAjax.send({
                flag: 4,
                fnServerParams: function(sData) {
                    sData.push({name: tabs.T3 + 'txt_modulo', value: ids});
                    sData.push({name: '_lengthArray', value: numeroPalabras});
                },
                root: _private.config.modulo + 'postOrdenarModulo'
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    _public.postSortMenu = function() {
        try {
            var ids = axScript.getParam(arguments[0]);
            var textoAreaDividido = ids.split(",");
            var numeroPalabras = textoAreaDividido.length;

            axAjax.send({
                flag: 4,
                fnServerParams: function(sData) {
                    sData.push({name: tabs.T3 + 'txt_menu', value: ids});
                    sData.push({name: '_lengthArray', value: numeroPalabras});
                },
                root: _private.config.modulo + 'postOrdenarMenu'
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };
    
    _public.postSortOpciones = function() {
        try {
            var ids = axScript.getParam(arguments[0]);
            var textoAreaDividido = ids.split(",");
            var numeroPalabras = textoAreaDividido.length;

            axAjax.send({
                flag: 4,
                fnServerParams: function(sData) {
                    sData.push({name: tabs.T3 + 'txt_opcion', value: ids});
                    sData.push({name: '_lengthArray', value: numeroPalabras});
                },
                root: _private.config.modulo + 'postOrdenarOpciones'
            });
        } catch (ex) {
            auditoria.logErrors(ex);
        }
    };

    return _public;

};
var Menu = new Menu_();

Menu.main();