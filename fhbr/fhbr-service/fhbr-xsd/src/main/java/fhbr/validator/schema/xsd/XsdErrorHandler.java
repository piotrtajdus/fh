/*
 * Copyright 2019 Asseco Poland S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file,
 * or at: http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

package fhbr.validator.schema.xsd;

import lombok.Getter;
import org.fhbr.api.model.ValidationMessage;
import org.fhbr.api.model.ValidationMessageSeverity;
import org.fhbr.api.model.ValidationResult;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.helpers.DefaultHandler;

/**
 * @author Dariusz Skrudlik
 * @version :  $, :  $
 * @created 07/07/2022
 */
public class XsdErrorHandler extends DefaultHandler {

    @Getter
    private ValidationResult validationResult = new ValidationResult();

    @Override
    public void error(SAXParseException e) throws SAXException {
        ValidationMessage schemaValidationMessage = new ValidationMessage(ValidationMessageSeverity.E, e.getLocalizedMessage(), computeCurrentXPath());
        validationResult.addValidationMessage(schemaValidationMessage);
    }

    private String computeCurrentXPath() {
        return null;
    }

    @Override
    public void fatalError(SAXParseException e) throws SAXException {
        ValidationMessage schemaValidationMessage = new ValidationMessage(ValidationMessageSeverity.E, e.getLocalizedMessage(), computeCurrentXPath());
        validationResult.addValidationMessage(schemaValidationMessage);
    }
}
