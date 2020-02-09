db.createCollection("sorters", {
    validator: {
        $jsonSchema: {
            bsonType: "array",
            items: {
                bsonType: "object",
                required: ["version", "sorter"],
                properties: {
                    version: {
                        bsonType: "date"
                    },
                    sorter: {
                        bsonType: "object",
                        required: ["name", "img", "shared", "status", "created_by", "created_date", "objects"],
                        properties: {
                            name: {
                                bsonType: "object",
                                patternProperties: {
                                    "^([a-z]|[A-Z]){2}(-([a-z]|[A-Z]){2})?$": {
                                        bsonType: "string",
                                        maxLength: 255
                                    }
                                }
                            },
                            description: {
                                bsonType: "object",
                                patternProperties: {
                                    "^([a-z]|[A-Z]){2}(-([a-z]|[A-Z]){2})?$": {
                                        bsonType: "string"
                                    }
                                }
                            },
                            img: {
                                bsonType: "string"
                            },
                            url: {
                                bsonType: "string"
                            },
                            shared: {
                                bsonType: "bool"
                            },
                            status: {
                                enum: ["Approved", "Pending", "Rejected"]
                            },
                            tags: {
                                bsonType: "array",
                                items: {
                                    bsonType: "string",
                                    maxLength: 255
                                }
                            },
                            created_by: {
                                bsonType: "objectId"
                            },
                            created_date: {
                                bsonType: "date"
                            },
                            contributions: {
                                bsonType: "array",
                                items: {
                                    bsonType: "object",
                                    required: ["user_id", "date"],
                                    properties: {
                                        user_id: {
                                            bsonType: "objectId"
                                        },
                                        date: {
                                            bsonType: "date"
                                        }
                                    }
                                }
                            },
                            objects: {
                                bsonType: "object",
                                required: ["entries"],
                                properties: {
                                    filters: {
                                        bsonType: "array",
                                        items: {
                                            bsonType: "object",
                                            required: ["name", "key"],
                                            properties: {
                                                name: {
                                                    bsonType: "object",
                                                    patternProperties: {
                                                        "^([a-z]|[A-Z]){2}(-([a-z]|[A-Z]){2})?$": {
                                                            bsonType: "string",
                                                            maxLength: 255
                                                        }
                                                    }
                                                },
                                                key: {
                                                    bsonType: "int"
                                                },
                                                groups: {
                                                    bsonType: "array",
                                                    items: {
                                                        bsonType: "object",
                                                        required: ["name", "key"],
                                                        properties: {
                                                            name: {
                                                                bsonType: "object",
                                                                patternProperties: {
                                                                    "^([a-z]|[A-Z]){2}(-([a-z]|[A-Z]){2})?$": {
                                                                        bsonType: "string",
                                                                        maxLength: 255
                                                                    }
                                                                }
                                                            },
                                                            key: {
                                                                bsonType: "int"
                                                            },
                                                            color: {
                                                                bsonType: "string",
                                                                pattern: "^#[0-9a-f]{6}$"
                                                            },
                                                            img: {
                                                                bsonType: "string"
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    entries: {
                                        bsonType: "object",
                                        required: ["name"],
                                        properties: {
                                            name: {
                                                bsonType: "object",
                                                patternProperties: {
                                                    "^([a-z]|[A-Z]){2}(-([a-z]|[A-Z]){2})?$": {
                                                        bsonType: "string",
                                                        maxLength: 255
                                                    }
                                                }
                                            },
                                            img: {
                                                bsonType: "string"
                                            },
                                            opts: {
                                                bsonType: "object",
                                                patternProperties: {
                                                    "^\d*$": {
                                                        bsonType: "array",
                                                        items: {
                                                            bsonType: "int"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})