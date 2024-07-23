

frappe.ui.form.on('Loading Transaction', {
    refresh: function(frm) {
        frm.fields_dict.entry_weight_button.$input.on('click', async function() {
            if ('serial' in navigator) {
                try {
                    console.log('Requesting serial port...');

                    // Prompt user to select a serial port.
                    const port = await navigator.serial.requestPort();
                    console.log('Serial port selected:', port);

                    // Open the serial port.
                    await port.open({ baudRate: 9600 });
                    console.log('Serial port opened');

                    const textDecoder = new TextDecoderStream();
                    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
                    const reader = textDecoder.readable.getReader();

                    console.log('Reading from serial port...');
                    let receivedData = '';
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) {
                            // Allow the serial port to be closed later.
                            reader.releaseLock();
                            break;
                        }
                        // Append the received chunk to the receivedData
                        receivedData += value;
                        console.log('Partial data received:', value);

                        // Check if the receivedData contains the complete message
                        if (receivedData.includes('\n')) {
                            const completeData = receivedData.trim();
                            console.log('Complete data received:', completeData);

                            // Extract the weight from the complete data
                            const weightMatch = completeData.match(/,\+(\d+)kg/);
                            if (weightMatch) {
                                const weight = weightMatch[1];
                                console.log('Extracted weight:', weight);
                                // Set the extracted weight in the entry_weight field
                                frm.set_value('entry_weight', weight);
                                frm.set_df_property('entry_weight', 'read_only', 1);
                            }
                            receivedData = '';  // Clear the receivedData for the next message
                        }
                    }

                    await readableStreamClosed.catch(() => { /* Ignore the error */ });
                    await port.close();
                    console.log('Serial port closed');
                } catch (error) {
                    console.log('Error:', error);
                    frappe.msgprint(__('Error: ') + error);
                }
            } else {
                frappe.msgprint(__('Web Serial API is not supported in this browser.'));
                console.log('Web Serial API is not supported in this browser.');
            }
        });
    }
});


// frappe.ui.form.on('Loading Transaction', {
//     onload: function(frm) {
//         console.log('Loading Transaction form loaded');
//     },
//     refresh: function(frm) {
//         frm.add_custom_button('Read Entry Weight', async function() {
//             if ('serial' in navigator) {
//                 try {
//                     console.log('Requesting serial port...');

//                     // Prompt user to select a serial port.
//                     const port = await navigator.serial.requestPort();
//                     console.log('Serial port selected:', port);

//                     // Open the serial port.
//                     await port.open({ baudRate: 9600 });
//                     console.log('Serial port opened');

//                     const textDecoder = new TextDecoderStream();
//                     const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
//                     const reader = textDecoder.readable.getReader();

//                     console.log('Reading from serial port...');
//                     let receivedData = '';
//                     while (true) {
//                         const { value, done } = await reader.read();
//                         if (done) {
//                             // Allow the serial port to be closed later.
//                             reader.releaseLock();
//                             break;
//                         }
//                         // Append the received chunk to the receivedData
//                         receivedData += value;
//                         console.log('Partial data received:', value);

//                         // Check if the receivedData contains the complete message
//                         if (receivedData.includes('\n')) {
//                             const completeData = receivedData.trim();
//                             console.log('Complete data received:', completeData);

//                             // Extract the weight from the complete data
//                             const weightMatch = completeData.match(/,\+(\d+)kg/);
//                             if (weightMatch) {
//                                 const weight = weightMatch[1];
//                                 console.log('Extracted weight:', weight);
//                                 // Set the extracted weight in the entry_weight field
//                                 frm.set_value('entry_weight', weight);
//                             }
//                             receivedData = '';  // Clear the receivedData for the next message
//                         }
//                     }

//                     await readableStreamClosed.catch(() => { /* Ignore the error */ });
//                     await port.close();
//                     console.log('Serial port closed');
//                 } catch (error) {
//                     console.log('Error:', error);
//                     frappe.msgprint(__('Error: ') + error);
//                 }
//             } else {
//                 frappe.msgprint(__('Web Serial API is not supported in this browser.'));
//                 console.log('Web Serial API is not supported in this browser.');
//             }
//         });

//         frm.add_custom_button('Read Exit Weight', async function() {
//             if ('serial' in navigator) {
//                 try {
//                     console.log('Requesting serial port...');

//                     // Prompt user to select a serial port.
//                     const port = await navigator.serial.requestPort();
//                     console.log('Serial port selected:', port);

//                     // Open the serial port.
//                     await port.open({ baudRate: 9600 });
//                     console.log('Serial port opened');

//                     const textDecoder = new TextDecoderStream();
//                     const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
//                     const reader = textDecoder.readable.getReader();

//                     console.log('Reading from serial port...');
//                     let receivedData = '';
//                     while (true) {
//                         const { value, done } = await reader.read();
//                         if (done) {
//                             // Allow the serial port to be closed later.
//                             reader.releaseLock();
//                             break;
//                         }
//                         // Append the received chunk to the receivedData
//                         receivedData += value;
//                         console.log('Partial data received:', value);

//                         // Check if the receivedData contains the complete message
//                         if (receivedData.includes('\n')) {
//                             const completeData = receivedData.trim();
//                             console.log('Complete data received:', completeData);

//                             // Extract the weight from the complete data
//                             const weightMatch = completeData.match(/,\+(\d+)kg/);
//                             if (weightMatch) {
//                                 const weight = weightMatch[1];
//                                 console.log('Extracted weight:', weight);
//                                 // Set the extracted weight in the exit_weight field
//                                 frm.set_value('exit_weight', weight);
//                             }
//                             receivedData = '';  // Clear the receivedData for the next message
//                         }
//                     }

//                     await readableStreamClosed.catch(() => { /* Ignore the error */ });
//                     await port.close();
//                     console.log('Serial port closed');
//                 } catch (error) {
//                     console.log('Error:', error);
//                     frappe.msgprint(__('Error: ') + error);
//                 }
//             } else {
//                 frappe.msgprint(__('Web Serial API is not supported in this browser.'));
//                 console.log('Web Serial API is not supported in this browser.');
//             }
//         });
//     }
// });
